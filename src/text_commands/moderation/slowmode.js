const Discord = require('discord.js');

const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'slowmode',
	description: "Change the slowmode time in the channel!",
	usage: '<number / off>',
	permissions: ["Manage Channels"],
	aliases: ["sm"],
	arguments: 1,
	async execute(message, args, prefix) {
		let error = false;

		if(args[0] == "off") {
			const off = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setDescription(`Slowmode has been turned off.`);

			const offError = new Discord.MessageEmbed()
				.setColor('RED')
				.setDescription('Sorry, an error occured when trying the slowmode off.');

			await message.channel.setRateLimitPerUser(0).catch(async () => {
				await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [offError] });
				error = true;
				return;
			});
			if(error == false) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [off] });
			}
		}
		else{

			const yay = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setDescription(`I have sucessfully set the slowmode to ${args[0]}s`)
				.setFooter(`Turn it off by doing '${prefix}slowmode off'`);

			const boo = new Discord.MessageEmbed()
				.setColor('RED')
				.setDescription(`Sorry, an error occured when setting the slowmode to ${args[0]}s`)
				.setFooter('Please make sure I have the corerct permissions.');

			if(Number(args[0]) > 21600) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'I\'m sorry, slowmode can not be longer than 6h (21400 seconds)' });
				return;
			}

			await message.channel.setRateLimitPerUser(args[0]).catch(async () => {
				await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [boo] });
				error = true;
			});
			if(error == false) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [yay] });
			}
		}
	}
};