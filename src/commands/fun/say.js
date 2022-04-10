const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'say',
	description: 'Makes the bot repeat your message!',
	usage: '`/say <message>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Makes me repeat your message!')
		.addStringOption(option => option
			.setName('message')
			.setDescription('What should I say?')
			.setRequired(true),
		),

	error: false,
	execute: async ({ interaction }) => {

		interaction.followUp({
			content: interaction.options.getString('message'),
			allowedMentions: { parse: [], users: [], roles: [] },
			ephemeral: false,
		});

	},
};
