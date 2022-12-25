const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

module.exports = {
	name: 'ban',
	description: 'Bans a member from the server.',
	usage: '`/ban <user> [days] [reason]`',

	permissions: ['Ban Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user from the server.')
		.setDMPermission(false)

		.addStringOption(option => option.setName('user').setDescription('The user to ban - @mention or ID').setRequired(true))
		.addIntegerOption(option => option
			.setName('days').setDescription('Do I purge their messages?').setMinValue(0).setMaxValue(7).setRequired(false),
		)
		.addStringOption(option => option.setName('reason').setDescription('Why are you banning them?').setRequired(false)),

	error: false,
	execute: async ({ interaction, client }) => {

		const userId = getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'I am unable to find that user.' });
			return;
		}

		const days = interaction.options.getInteger('days') || 0;
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`🔨 Banned: ${user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		interaction.guild.members.ban(user, { days, reason: `Mod: ${interaction.user.tag}\nReason: ${reason}` })
			.then(async () => {

				const guildData = await database.getValue(interaction.guild.id);
				if (!guildData.Moderation.cases[user.id]) guildData.Moderation.cases[user.id] = [];
				guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

				const object = {
					type: 'ban',
					case: guildData.Moderation.case,
					reason: reason,

					username: user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				guildData.Moderation.cases[user.id] = [object].concat(guildData.Moderation.cases[user.id]);
				await database.setValue(interaction.guild.id, guildData);

				if (guildData.Moderation.logs.on == true) {
					const channel = interaction.guild.channels.cache.get(guildData.Moderation.logs.channel);
					channel?.send({ embeds: [logEmbed] }).catch(() => false);
				}

				interaction.followUp({ content: `${user.tag} has been banned.`, ephemeral: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
