const { MessageEmbed } = require('discord.js');

const possibleAnswers = [
	'As I see it, yes.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don’t count on it.',
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
	'Yes – definitely.',
	'You may rely on it.',
];

module.exports = {
	name: '8ball',
	description: 'Ask the all knowing, magic 8ball a question!',
	usage: '<question>',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	options: [
		{ name: 'question', description: 'What is your question?', type: 'STRING', required: true },
	],

	error: false,
	execute: async ({ interaction }) => {

		const embed = new MessageEmbed()
			.setTitle('Magic 8 Ball')
			.addField('**Your Question:**', `${interaction.options.getString('question')}`)
			.addField('**My Answer**', `${possibleAnswers[Math.floor((Math.random() * 19) + 0)]}`)
			.setColor('RANDOM')
			.setThumbnail('https://i.imgur.com/SD5OXUV.jpg');

		interaction.followUp({ embeds: [embed] });

	},
};
