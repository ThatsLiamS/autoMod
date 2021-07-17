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

		if(args[0] == "off") {


			await message.channel.setRateLimitPerUser(0).catch(async (err) => {
				await send.error(err, message.channel, `I am unable to turn off slowmode.`);
				return;
			});

			const off = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setDescription(`Slowmode has been turned off.`);

			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [off] });

		}
		else{

			const number = args[0];

			if(isNaN(number)) {
				await send.error({ name: `TypeError`, message: `Argument Must Be Number` }, message.channel, `Usage: ${prefix}${this.name} ${this.usage}`);
				return;
			}

			if(number < 1 || 100 < number) {
				await send.error({ name: `TypeError`, message: `Number Out Of Bounds` }, message.channel, `Usage: ${prefix}${this.name} ${this.usage}`);
				return;
			}

			await message.channel.setRateLimitPerUser(args[0]).catch(async (err) => {
				await send.error(err, message.channel, `I am unable to turn off slowmode.`);
				return;
			});

			const completed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setDescription(`I have sucessfully set the slowmode to ${args[0]}s`)
				.setFooter(`Turn it off by doing '${prefix}slowmode off'`);

			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [completed] });
		}
	}
};