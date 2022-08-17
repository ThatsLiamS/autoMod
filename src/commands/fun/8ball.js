const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
	usage: '`/8ball <question>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the all knowing, magic 8ball a question!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('question').setDescription('What is your question').setRequired(true)),

	error: false,
	execute: async ({ interaction }) => {

		const embed = new EmbedBuilder()
			.setTitle('Magic 8 Ball')
			.addField('**Your Question:**', `${interaction.options.getString('question')}`)
			.addField('**My Answer**', `${possibleAnswers[Math.floor((Math.random() * 19) + 0)]}`)
			.setColor('Gray')
			.setThumbnail('https://i.imgur.com/SD5OXUV.jpg');

		interaction.followUp({ embeds: [embed] });

	},
};
