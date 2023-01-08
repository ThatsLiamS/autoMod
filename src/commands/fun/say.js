// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'say',
	description: 'Makes the bot repeat your message!',
	usage: '/say <message>',

	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Makes me repeat your message!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('message').setDescription('What should I say?').setRequired(true)),

	cooldown: { time: 0, text: 'None (0)' },
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

		/* Formats into a blockquote */
		const message = interaction.options.getString('message')
			.split('\n').map((line) => '> ' + line).join('\n');

		/* Responds to the user */
		interaction.followUp({
			content: `${message}\n\n**- ${interaction.user.username}**`,
			allowedMentions: { parse: [], users: [], roles: [] },
			ephemeral: false,
		});

		return true;

	},
};
