const Discord = require('discord.js');

const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'clear',
	description: "Bulk delete messages",
	usage: '<number 1-100>',
	permissions: ["Manage Messages"],
	aliases: ["purge"],
	arguments: 1,
	async execute(message, args) {

		const errormessage = new Discord.MessageEmbed()
			.setTitle(`Error`)
			.setColor(`RED`)
			.setDescription(`An error occured when clearing messages. Please make sure I have permission to manage messages, and the messages are not older than 14 days (Discord API limit)`)
			.setFooter(`I'm sorry :sob:`);

		const LolTooHigh = new Discord.MessageEmbed()
			.setTitle(`Too High`)
			.setColor(`RED`)
			.setDescription(`I'm sorry but I can not delete more then 100 messages in one command.`)
			.setFooter(`This is a Discord API limit, we have no control on his.`);

		if (Number(args[0]) > 100) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [LolTooHigh] });
			return;
		}

		await message.delete().catch();
		message.channel.bulkDelete(args[0]).catch(async () => {
			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [errormessage] });
		}).catch();
	}
};