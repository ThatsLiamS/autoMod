// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const possibleAnswers = [
	'As I see it, yes.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don\'t count on it.',
	'It is certain.',
	'It is decidedly so.',
	'Most likely.',
	'My reply is no.',
	'My sources say no.',
	'Outlook not so good.',
	'Outlook good.',
	'Reply hazy, try again.',
	'Signs point to yes.',
	'Very doubtful.',
	'Without a doubt.',
	'Yes.',
	'Yes - definitely.',
	'You may rely on it.',
];

module.exports = {
	name: '8ball',
	description: 'Ask the all knowing, magic 8ball a question!',
	usage: '/8ball <question>',

	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the all knowing, magic 8ball a question!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('question').setDescription('What is your question').setRequired(true)),

	cooldown: { time: 0, text: 'None (0)' },
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

		/* Creates the embed reponse */
		const embed = new EmbedBuilder()
			.setTitle('Magic 8 Ball')
			.addFields(
				{ name: '**Your Question:**', value: `${interaction.options.getString('question')}` },
				{ name: '**My Answer**', value: `${possibleAnswers[Math.floor((Math.random() * possibleAnswers.length))]}` },
			)
			.setThumbnail('https://i.imgur.com/SD5OXUV.jpg');

		/* Responds to the user */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
