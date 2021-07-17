const Discord = require('discord.js');
const fs = require('fs');

const send = require(`${__dirname}/../../util/send`);

let enable = new Discord.Collection();
const files = fs.readdirSync(`${__dirname}/enable/`).filter(File => File.endsWith('.js'));
for (const file of files) {
	const fileinfo = require(`${__dirname}/enable/${file}`);
	enable.set(fileinfo.name, fileinfo);
}

module.exports = {
	name: 'enable',
	description: "Provides the ability to toggle certain features on, to help suit your server!\n\nThe features are: `word-filter` and `logs`",
	usage: '<feature> <channel>',
	permissions: ['administrator'],
	arguments: 2,
	async execute(message, args, prefix, client, firestore) {


		const file = enable.get(args[0]);
		if(!file) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `That is not a valid feature! To view the features do \`${prefix}help disable\`` });
			return;
		}

		file.execute(message, args, prefix, client, firestore);

	}
};