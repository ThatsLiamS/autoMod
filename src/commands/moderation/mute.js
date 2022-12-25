const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

const options = {
	's': 1000, 'm': 60 * 1000,
	'h': 3600 * 1000, 'd': 24 * 3600 * 1000,
	'w': 7 * 24 * 3600 * 1000,
};

module.exports = {
	name: 'mute',
	description: 'Sets a temporary timeout for a user.',
	usage: '`/mute <member> <duration> <units> [reason]`',

	permissions: ['Moderator Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Applies a timeout to a user')
		.setDMPermission(false)

		.addStringOption(option => option.setName('member').setDescription('The member to mute - @mention or ID').setRequired(true))
		.addIntegerOption(option => option.setName('duration').setDescription('How long for?').setRequired(true))
		.addStringOption(option => option
			.setName('units').setRequired(true).setDescription('How long for?')
			.addChoices(
				{ name: 'Seconds', value: 's' }, { name: 'Minutes', value: 'm' }, { name: 'Hours', value: 'h' },
				{ name: 'Days', value: 'd' }, { name: 'Weeks', value: 'w' },
			),
		)
		.addStringOption(option => option.setName('reason').setDescription('Why are we muting them?')),


	cooldown: { time: 10, text: '10 seconds' },
	error: false,
	execute: async ({ interaction }) => {

		const userId = getUserId({ string: interaction.options.getString('member') });
		const member = interaction.guild.members.cache.get(userId);
		if (!member) {
			return interaction.followUp({ content: 'I am unable to find that member.' });
		}

		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';
		const time = interaction.options.getInteger('duration') * options[interaction.options.getString('units')];

		member.timeout(time, reason)
			.then(async () => {

				const guildData = await database.getValue(interaction.guild.id);
				if (!guildData.Moderation.cases[member.id]) guildData.Moderation.cases[member.id] = [];
				guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

				const object = {
					type: 'mute',
					case: guildData.Moderation.case,
					reason: reason,

					username: member.user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				guildData.Moderation.cases[member.id] = [object].concat(guildData.Moderation.cases[member.id]);
				await database.setValue(interaction.guild.id, guildData);

				if (guildData.Moderation.logs.on == true) {
					const embed = new EmbedBuilder()
						.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`⌛ Timeout: ${member.user.tag}`)
						.setColor('#DC143C')
						.addFields(
							{ name: '**User**', value: `${member.user.tag} (${member.id})`, inline: false },
							{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
							{ name: '**Reason**', value: `${reason}`, inline: false },
						)
						.setTimestamp();
					const channel = interaction.guild.channels.cache.get(guildData.Moderation.logs.channel);
					channel.send({ embeds: [embed] });
				}


				interaction.followUp({ content: `${member.user.tag} has been muted.`, ephemeral: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

	},
};