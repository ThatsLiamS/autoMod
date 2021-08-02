const Discord = require('discord.js');

const { bot } = require(`${__dirname}/../../util/values`);

module.exports = {
	name: 'coinflip',
	description: 'Flip a coin! Very good for making decisions!',
	async execute(interaction) {

		await interaction.defer({ ephemeral: false });

		const num = Math.floor((Math.random() * 100) + 0);

		let flip = (num % 2 == 0) ? 'tails' : 'heads';
		if(num == 73) { flip = `its side! Impressive`; }

		const embed = new Discord.MessageEmbed()
			.setTitle(`Coin Flipper`)
			.setDescription(`The coin landed on ${flip}\n\nPowered by [@${bot.partners.CoinFlipper.tag}](${bot.partners.CoinFlipper.website})`)
			.setColor(`#cd7f32`)
			.setThumbnail(`https://i.imgur.com/4Zw6qky.png`);

		await interaction.followUp({ embeds: [embed] });

	}
};