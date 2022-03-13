const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'kick',
	description: 'Kicks a member from the server.',
	usage: '<user> [reason]',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kicks a user from the server.')

		.addSubcommand(subcommand => subcommand
			.setName('by-user')
			.setDescription('kicks a user from the server.')
			.addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are you kicking them?').setRequired(false)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('by-user-id')
			.setDescription('kicks a user from the server.')
			.addStringOption(option => option.setName('user').setDescription('The user ID to kick').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are you kicking them?').setRequired(false)),
		),

	error: false,
	execute: async ({ interaction, firestore, client }) => {

		const userId = interaction.options.getSubcommand() == 'by-user' ? interaction.options.getUser('user').id : interaction.options.getUser('user');
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'I am unable to find that user.' });
			return;
		}

		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`🔨 Kicked: ${user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		interaction.guild.members.kick(user, `Mod: ${interaction.user.tag}\nReason: ${reason}`)
			.then(async () => {

				const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
				const serverData = collection.data() || defaultData['guilds'];

				if (!serverData['moderation logs'][user.id]) serverData['moderation logs'][user.id] = [];
				serverData['moderation logs']['case'] = Number(serverData['moderation logs']['case']) + 1;

				const object = {
					type: 'kick',
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

				interaction.followUp({ content: `${user.tag} has been kicked.`, ephemeral: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
