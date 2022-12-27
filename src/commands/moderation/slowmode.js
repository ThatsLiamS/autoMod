const { SlashCommandBuilder } = require('discord.js');

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
	execute: async ({ interaction }) => {

		const number = Number(interaction.options.getInteger('duration')) * options[interaction.options.getString('units')];
		if (number > 21600) {
			interaction.followUp({ content: 'Slowmode cannot be set longer than 6 hours' });
			return;
		}

		interaction.channel.setRateLimitPerUser(number)
			.then(() => interaction.followUp({ content: 'Successfully set the slowmode.', ephermal: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

		return true;

	},
};
