const Discord = require('discord.js');

const possibleAnswers = [
	`As I see it, yes.`,
	`Ask again later.`,
	`Better not tell you now.`,
	`Cannot predict now.`,
	`Concentrate and ask again.`,
	`Don’t count on it.`,
	`It is certain.`,
	`It is decidedly so.`,
	`Most likely.`,
	`My reply is no.`,
	`My sources say no.`,
	`Outlook not so good.`,
	`Outlook good.`,
	`Reply hazy, try again.`,
	`Signs point to yes.`,
	`Very doubtful.`,
	`Without a doubt.`,
	`Yes.`,
	`Yes – definitely.`,
	`You may rely on it.`
];

module.exports = {
	name: '8ball',
	description: 'Ask a question, and get an answer from the all-knowing, magic 8ball!',
	usage: '<question>',
	options: [
		{ name: 'question', description: 'Submit your question!', type: 'STRING', required: true },
	],
	async execute(interaction) {

		await interaction.defer({ ephemeral: false });

		const question = interaction.options.getString("question");

		const embed = new Discord.MessageEmbed()
			.setTitle(`Magic 8 Ball`)
			.addField(`**Your Question:**`, `${question}`)
			.addField(`**My Answer**`, `${possibleAnswers[Math.floor((Math.random() * possibleAnswers.length) + 0)]}`)
			.setColor(`RANDOM`)
			.setThumbnail(`https://i.imgur.com/SD5OXUV.jpg`);

		await interaction.followUp({ embeds: [embed] });

	}
};