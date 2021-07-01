const Discord = require('discord.js');
const send = require(`${__dirname}/../../util/send`);
const { bot } = require(`${__dirname}/../../util/values`);

module.exports = {
	name: 'coinflip',
	description: 'Flip a coin! Very good for making decisions.',
	aliases: ["cf", "coinflipper"],
	arguments: 0,
	async execute(message) {

		const flip = Math.floor((Math.random() * 100) + 0);
		let ans = `heads`;

		if(flip % 2 == 0) {
			ans = `tails`;
		}

		if(flip == 73) {
			ans = `its side! Impressive`;
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(`Coin Flipper`)
			.setDescription(`The coin landed on ${ans}\n\nPowered by [@${bot.partners.CoinFlipper.tag}](${bot.partners.CoinFlipper.website})`)
			.setColor(`#cd7f32`)
			.setThumbnail(`https://i.imgur.com/4Zw6qky.png`);

		const yes = await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		console.log(yes);
	}
};
