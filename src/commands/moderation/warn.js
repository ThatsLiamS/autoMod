const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

module.exports = {
	name: 'warn',
	description: 'Warns a member.',
	usage: '`/warn <user> [reason]`',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns a user')
		.setDMPermission(false)

		.addStringOption(option => option.setName('user').setDescription('The user to warn - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are we warning them?').setRequired(true)),

	error: false,
	execute: async ({ interaction, client }) => {

		const userId = getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'I am unable to find that user.' });
			return;
		}
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`⚠️ Warned: ${user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const userEmbed = new EmbedBuilder()
			.setTitle('⚠️ You have been warned!')
			.setColor('#DC143C')
			.addFields(
				{ name: '**Server**', value: `${interaction.guild} (${interaction.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const guildData = await database.getValue(interaction.guild.id);
		if (!guildData.Moderation.cases[user.id]) guildData.Moderation.cases[user.id] = [];
		guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

		const object = {
			type: 'warn',
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
		user.send({ embeds: [userEmbed] }).catch(() => { return; });

		interaction.followUp({ content: `${user.tag} has been warned.`, ephemeral: true });
	},
};
