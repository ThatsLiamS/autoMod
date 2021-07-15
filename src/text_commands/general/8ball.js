const Discord = require('discord.js');

const send = require(`${__dirname}/../../util/send`);

const possibleAnswers = [`As I see it, yes.`,
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
	aliases: ["8-ball"],
	usage: '<question>',
	arguments: 1,
	async execute(message, args) {

		const embed = new Discord.MessageEmbed()
			.setTitle(`Magic 8 Ball`)
			.addField(`**Your Question:**`, `${args.slice(0).join(" ")}`)
			.addField(`**My Answer**`, `${possibleAnswers[Math.floor((Math.random() * 19) + 0)]}`)
			.setColor(`RANDOM`)
			.setThumbnail(`https://i.imgur.com/SD5OXUV.jpg`);

		await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

	}
};