const Discord = require('discord.js');
const fs = require('fs');

const send = require(`${__dirname}/../../util/send`);

let disable = new Discord.Collection();
const files = fs.readdirSync(`${__dirname}/disable/`).filter(File => File.endsWith('.js'));
for (const file of files) {
	const fileinfo = require(`${__dirname}/disable/${file}`);
	disable.set(fileinfo.name, fileinfo);
}

module.exports = {
	name: 'disable',
	description: "Provides the ability to toggle certain features off, to help suit your server!\n\nThe features are: `word-filter`, `logs`",
	usage: '<feature>',
	permissions: ["administrator"],
	arguments: 1,
	async execute(message, args, prefix, client, firestore) {

		const file = disable.get(args[0]);
		if(!file) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `That is not a valid feature! To view the features do \`${prefix}help disable\`` });
			return;
		}

		file.execute(message, args, prefix, client, firestore);

	}
};
