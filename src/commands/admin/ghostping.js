// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'ghostping',
	description: 'Sets up the ghostping detection system',
	usage: '/ghostping setup <channel>\n/ghostping enable\n/ghostping disable',

	permissions: ['Manage Guild'],
	data: new SlashCommandBuilder()
		.setName('ghostping')
		.setDescription('Contains all the ghostping sub-commands!')

		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageEvents)

		.addSubcommand(subcommand => subcommand
			.setName('setup')
			.setDescription('Sets up the ghostping detection system')
			.addChannelOption(option => option.setName('channel').setDescription('Where should it be logged')
				.setRequired(true).addChannelTypes(ChannelType.GuildText | ChannelType.GuildAnnouncement)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Enables the ghostping detection system'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Disables the ghostping detection system'),
		),

	cooldown: { time: 15, text: '15 seconds' },
	defer: { defer: true, ephemeral: true },

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
			const channel = interaction.options.getChannel('channel');

			/* Sets the new value in the database */
			guildData.GhostPing.channel = channel.id;
			const embed = new EmbedBuilder()
				.setTitle('Successfully set up!')
				.setColor('Green')
				.setDescription(`The **Ghost Ping Detector** has been set up to ${channel}. Use the \`/ghostping enable\` command to turn it on.`);

			/* Responds to the user */
			interaction.followUp({ embeds: [embed] });
		}

		if (subCommandName == 'enable') {

			/* Has it been set up */
			if (!guildData.GhostPing.channel || guildData.GhostPing.channel == '') {
				const embed = new EmbedBuilder()
					.setTitle('An error has occurred!')
					.setColor('Red')
					.setDescription('The **Ghost Ping Detector** is required to be setup before being enabled. Please run the `/ghostping setup <channel>` command and try again.');

				interaction.followUp({ embeds: [embed] });
				return false;
			}

			/* Is it already enabled */
			if (guildData.GhostPing.on == true) {
				interaction.followUp({ content: 'The **Ghost Ping Detector** is already enabled in this server.' });
				return false;
			}

			guildData.GhostPing.on = true;
			interaction.followUp({ content: 'The **Ghost Ping Detector** has been enabled.' });
		}

		if (subCommandName == 'disable') {
			/* Is it already disabled */
			if (guildData.GhostPing.on != true) {
				interaction.followUp({ content: 'The **Ghost Ping Detector** is already disabled in this server.' });
				return false;
			}

			guildData.GhostPing.on = false;
			interaction.followUp({ content: 'The **Ghost Ping Detector** has been disabled.' });
		}

		/* Sets the value into the database */
		await database.setValue(interaction.guild.id, guildData);
		return true;

	},
};
