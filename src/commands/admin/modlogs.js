// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'modlogs',
	description: 'Sets up the moderation log system',
	usage: '`/modlogs setup <channel>`\n`/modlogs enable`\n`/modlogs disable`',

	permissions: ['Manage Guild'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('modlogs')
		.setDescription('Contains all the moderation log sub-commands!')
		.setDMPermission(false)

		.addSubcommand(subcommand => subcommand
			.setName('setup')
			.setDescription('Sets up the moderation log system')
			.addChannelOption(option => option.setName('channel').setDescription('Where should it be logged').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Enables the modlog system'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Disables the modlog system'),
		),

	cooldown: { time: 15, text: '15 seconds' },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {

		/* Fetch the subcommand that's used */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Fetch the Guild's information */
		const guildData = await database.getValue(interaction.guild.id);


		if (subCommandName == 'setup') {
			/* Checks it is a valid channel */
			const channel = interaction.options.getChannel('channel');
			if (!channel || (channel?.type != 0 && channel?.type != 5)) {
				interaction.followUp({ content: 'Please mention a valid text channel.' });
				return false;
			}

			/* Sets the new value in the database */
			guildData.Moderation.logs.channel = channel.id;
			const embed = new EmbedBuilder()
				.setTitle('Successfully set up!')
				.setColor('Green')
				.setDescription(`The **Moderation Logs** have been set up to ${channel}. Use the \`/modlogs enable\` command to turn it on.`);

			/* responds to the user */
			interaction.followUp({ embeds: [embed] });
		}

		if (subCommandName == 'enable') {

			/* Has it been set up? */
			if (!guildData.Moderation.logs.channel || guildData.Moderation.logs.channel == '') {
				const embed = new EmbedBuilder()
					.setTitle('An error has occurred!')
					.setColor('Red')
					.setDescription('The **Moderation Logs** are required to be setup before being enabled. Please run the `/modlogs setup <channel>` command and try again.');

				interaction.followUp({ embeds: [embed] });
				return false;
			}

			/* Is it already enabled */
			if (guildData.Moderation.logs.on == true) {
				interaction.followUp({ content: 'The **Moderation Logs** are already enabled in this server.' });
				return false;
			}

			guildData.Moderation.logs.on = true;
			interaction.followUp({ content: 'The **Moderation Logs** have been enabled.' });
		}

		if (subCommandName == 'disable') {
			/* Is it already disabled */
			if (guildData.Moderation.logs.on != true) {
				interaction.followUp({ content: 'The **Moderation Logs** are already disabled in this server.' });
				return false;
			}

			guildData.Moderation.logs.on = false;
			interaction.followUp({ content: 'The **Moderation Logs** have been disabled.' });
		}

		/* Sets the values in the database */
		await database.setValue(interaction.guild.id, guildData);
		return true;

	},
};
