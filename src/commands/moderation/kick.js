const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const defaultData = require('./../../utils/defaults');
const mention = require('./../../utils/mentions.js');

module.exports = {
	name: 'kick',
	description: 'Kicks a member from the server.',
	usage: '`/kick <member> [reason]`',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kicks a user from the server.')
		.setDMPermission(false)

		.addStringOption(option => option.setName('member').setDescription('The member to kick - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are you kicking them?').setRequired(false)),

	error: false,
	execute: async ({ interaction, firestore }) => {

		const userId = mention.getUserId({ string: interaction.options.getString('member') });
		const member = interaction.guild.members.cache.get(userId);
		if (!member) {
			interaction.followUp({ content: 'I am unable to find that member.' });
			return;
		}

		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`🔨 Kicked: ${member.user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${member.user.tag} (${member.user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		interaction.guild.members.kick(member, `Mod: ${interaction.user.tag}\nReason: ${reason}`)
			.then(async () => {

				const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
				const serverData = collection.data() || defaultData['guilds'];

				if (!serverData['moderation logs'][member.id]) serverData['moderation logs'][member.id] = [];
				serverData['moderation logs']['case'] = Number(serverData['moderation logs']['case']) + 1;

				const object = {
					type: 'kick',
					case: serverData['moderation logs']['case'],
					reason: reason,

					username: member.user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				serverData['moderation logs'][member.id] = [object].concat(serverData['moderation logs'][member.id]);
				await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);

				if (serverData['logs']['on'] == true) {
					const channel = interaction.guild.channels.cache.get(serverData['logs'].channel);
					channel.send({ embeds: [logEmbed] });
				}

				interaction.followUp({ content: `${member.user.tag} has been kicked.`, ephemeral: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
