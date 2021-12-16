module.exports = {
	name: 'slowmode',
	description: 'Set the slowmode of a channel.',
	usage: '<amount>',

	permissions: ['Manage Channels'],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'time', description: 'How long should it be? (in seconds)', type: 'INTEGER', required: true },
	],

	error: false,
	execute: async ({ interaction }) => {

		const number = Number(interaction.options.getInteger('time'));

		if (number > 21600) {
			interaction.followUp({ content: 'Please specify a number between 0s and 21600s (6 hours).' });
			return;
		}

		interaction.channel.setRateLimitPerUser(number)
			.then(() => interaction.followUp({ content: 'Successfully set the slowmode.', ephermal: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occured, please double check my permissions.', ephermal: true }));

	},
};
