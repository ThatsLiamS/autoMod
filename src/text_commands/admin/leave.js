const send = require(`${__dirname}/../../util/send`);
const Discord = require('discord.js');
const { bot } = require(`${__dirname}/../../util/values`);

module.exports = {
	name: 'leave',
	description: "Forces autoMod to leave the server :sob:",
	ownerOnly: true,
	arguments: 0,
	async execute(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Good Bye!")
			.setDescription(`Goodbye everyone, I am sorry I could no longer be of service to you.\n\nIf you ever want to invite me to your own server or back to this one, click [here](${bot.invite})`);

		await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		message.guild.leave();
	}
};
