const Discord = require('discord.js');

const send = require(`${__dirname}/../../../util/send`);

module.exports = {
	name: 'logs',
	permissions: ["administrator"],
	async execute(message, args, prefix, client, firestore) {


		await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
			logs: {
				on: false,
			}
		});

		const Successful = new Discord.MessageEmbed()
			.setTitle('Logs successfully removed')
			.setColor('RED')
			.setDescription(`I will no longer log moderation actions.`)
			.setFooter(`Requested by ${message.author.tag}`)
			.setTimestamp();

		await send.sendChannel({ channel: message.channel, author: message.author }, { embds: [Successful] });
	}
};
