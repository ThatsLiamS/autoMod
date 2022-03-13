const { SlashCommandBuilder } = require('@discordjs/builders');

const options = {
	's': 1000, 'm': 60 * 1000,
	'h': 3600 * 1000, 'd': 24 * 3600 * 1000,
	'w': 7 * 24 * 3600 * 1000,
};

module.exports = {
	name: 'slowmode',
	description: 'Set the slowmode of a channel.',
	usage: '<duration> <units>',

	permissions: ['Manage Channels'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Applies or removes a channel slowmode')

		.addIntegerOption(option => option.setName('duration').setDescription('How long for? (0 to remove)').setRequired(true))
		.addStringOption(option => option
			.setName('units').setRequired(true)
			.setDescription('How long for?')
			.addChoice('Seconds', 's')
			.addChoice('Minutes', 'm')
			.addChoice('Hours', 'h'),
		),

	error: false,
	execute: async ({ interaction }) => {

		const number = Number(interaction.options.getInteger('duration')) * options[interaction.options.getString('units')];
		if (number > 21600) {
			interaction.followUp({ content: 'Slowmode cannot be set longer than 6 hours' });
			return;
		}

		interaction.channel.setRateLimitPerUser(number)
			.then(() => interaction.followUp({ content: 'Successfully set the slowmode.', ephermal: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

	},
};
