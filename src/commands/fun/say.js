module.exports = {
	name: 'say',
	description: 'Makes the bot repeat your message!',
	usage: '<message>',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	options: [
		{ name: 'message', description: 'What should I say?', type: 'STRING', required: true },
	],

	error: false,
	execute: async ({ interaction }) => {

		interaction.followUp({
			content: interaction.options.getString('message'),
			allowedMentions: { parse: [], users: [], roles: [] },
			ephemeral: false,
		});

	},
};
