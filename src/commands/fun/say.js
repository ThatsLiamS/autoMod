const { SlashCommandBuilder } = require('discord.js');

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
		.setDMPermission(true)

		.addStringOption(option => option.setName('message').setDescription('What should I say?').setRequired(true)),

	error: false,
	execute: async ({ interaction }) => {

		const message = interaction.options.getString('message')
			.split('\n').map((line) => '> ' + line).join('\n');

		interaction.followUp({
			content: `${message}\n\n- ${interaction.user.username}`,
			allowedMentions: { parse: [], users: [], roles: [] },
			ephemeral: false,
		});

	},
};
