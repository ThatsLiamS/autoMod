const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'unban',
	description: 'Unbans a member from the server.',
	usage: '`/unban <user ID> [reason]`',

	permissions: ['Ban Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a member from the server')
		.setDMPermission(false)

		.addStringOption(option => option.setName('user').setDescription('The user ID to unban').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are we unbanning them?')),

	cooldown: { time: 10, text: '10 seconds' },
	error: false,
	execute: async ({ interaction, client }) => {

		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}

		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`Unbanned: ${user.tag}`)
			.setColor('Green')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		interaction.guild.members.unban(user, `Mod: ${interaction.user.tag}\nReason: ${reason}`)
			.then(async () => {

				const guildData = await database.getValue(interaction.guild.id);
				if (!guildData.Moderation.cases[user.id]) guildData.Moderation.cases[user.id] = [];
				guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

				const object = {
					type: 'unban',
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

				interaction.followUp({ content: `${user.tag} has been unbanned.`, ephermal: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
