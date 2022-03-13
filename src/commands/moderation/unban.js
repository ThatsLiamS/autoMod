const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'unban',
	description: 'Unbans a member from the server.',
	usage: '<user ID> [reason]',

	permissions: ['Ban Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a member from the server')

		.addStringOption(option => option.setName('user').setDescription('The user ID to unban').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are we unbanning them?')),

	error: false,
	execute: async ({ interaction, firestore, client }) => {

		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}

		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`Unbanned: ${user.tag}`)
			.setColor('GREEN')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		interaction.guild.members.unban(user, `Mod: ${interaction.user.tag}\nReason: ${reason}`)
			.then(async () => {

				const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
				const serverData = collection.data() || defaultData['guilds'];

				if (!serverData['moderation logs'][user.id]) serverData['moderation logs'][user.id] = [];
				serverData['moderation logs']['case'] = Number(serverData['moderation logs']['case']) + 1;

				const object = {
					type: 'unban',
					case: serverData['moderation logs']['case'],
					reason: reason,

					username: user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				serverData['moderation logs'][user.id] = [object].concat(serverData['moderation logs'][user.id]);
				await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);

				if (serverData['logs']['on'] == true) {
					const channel = interaction.guild.channels.cache.get(serverData['logs'].channel);
					channel.send({ embeds: [logEmbed] });
				}

				interaction.followUp({ content: `${user.tag} has been unbanned.`, ephermal: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
