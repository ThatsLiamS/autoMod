// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { calculateTime } = require('./../../utils/functions.js');

module.exports = {
	name: 'slowmode',
	description: 'Set the slowmode of a channel.',
	usage: '/slowmode <duration> <units>',

	permissions: ['Manage Channels'],
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Applies or removes a channel slowmode')

		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)

		.addIntegerOption(option => option.setName('duration').setDescription('How long for? (0 to remove)').setRequired(true))
		.addStringOption(option => option
			.setName('units').setRequired(true).setDescription('How long for?').addChoices(
				{ name: 'Seconds', value: 's' }, { name: 'Minutes', value: 'm' }, { name: 'Hours', value: 'h' }),
		),

	cooldown: { time: 10, text: '10 seconds' },
	defer: { defer: true, ephemeral: false },

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {

		/* Calculate total time in ms */
		const dur = Number(interaction.options.getInteger('duration'));
		const units = interaction.options.getString('units');
		const time = Math.floor(Number(calculateTime(dur, units) / 1000));

		if (time > 21600) {
			/* Higher than the Discord Max */
			interaction.followUp({ content: 'Slowmode cannot be set longer than 6 hours' });
			return;
		}

		/* Attempts to set the rate limit */
		interaction.channel.setRateLimitPerUser(time)
			.then(() => interaction.followUp({ content: 'Successfully set the slowmode.', ephermal: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

		return true;

	},
};
