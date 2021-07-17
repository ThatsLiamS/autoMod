const Discord = require('discord.js');

const send = require(`${__dirname}/../../../util/send`);
const mention = require(`${__dirname}/../../../util/mention`);

module.exports = {
	name: 'logs',
	permissions: ["administrator"],
	async execute(message, args, prefix, client, firestore) {

		const channel = await mention.getChannel(message.guild, args[1]) || message.guild.channels.cache.get(args[1]);
		if(!channel) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Channel not found.` });
			return;
		}

		await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
			logs: {
				on: true,
				channel: channel.id,
			}
		});

		const Successful = new Discord.MessageEmbed()
			.setTitle('Logs successfully set')
			.setColor('GREEN')
			.setDescription(`All my moderaton logs will now be sent to ${channel}`)
			.setFooter(`Requested by ${message.author.tag}`)
			.setTimestamp();

		await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [Successful] });
	}
};
