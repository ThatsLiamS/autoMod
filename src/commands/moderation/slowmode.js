// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

const options = {
	's': 1000, 'm': 60 * 1000, 'h': 3600 * 1000,
};

module.exports = {
	name: 'slowmode',
	description: 'Set the slowmode of a channel.',
	usage: '`/slowmode <duration> <units>`',

	permissions: ['Manage Channels'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Applies or removes a channel slowmode')
		.setDMPermission(false)

		.addIntegerOption(option => option.setName('duration').setDescription('How long for? (0 to remove)').setRequired(true))
		.addStringOption(option => option
			.setName('units').setRequired(true).setDescription('How long for?').addChoices(
				{ name: 'Seconds', value: 's' }, { name: 'Minutes', value: 'm' }, { name: 'Hours', value: 'h' }),
		),

	cooldown: { time: 10, text: '10 seconds' },
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

		/* Calculates how long */
		const number = Number(interaction.options.getInteger('duration')) * options[interaction.options.getString('units')];
		if (number > 21600) {
			/* Higher than the Discord Max */
			interaction.followUp({ content: 'Slowmode cannot be set longer than 6 hours' });
			return;
		}

		/* Attempts to set the rate limit */
		interaction.channel.setRateLimitPerUser(number)
			.then(() => interaction.followUp({ content: 'Successfully set the slowmode.', ephermal: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

		return true;

	},
};
