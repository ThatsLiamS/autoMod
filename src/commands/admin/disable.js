const Discord = require('discord.js');
const send = require(`${__dirname}/../../util/send`);

const fs = require('fs');
let disable = new Discord.Collection();
const files = fs.readdirSync(`${__dirname}/disable/`).filter(File => File.endsWith('.js'));
for (const file of files) {
	const fileinfo = require(`${__dirname}/disable/${file}`);
	disable.set(fileinfo.name, fileinfo);
}

module.exports = {
	name: 'disable',
	description: "Provides the ability to toggle certain features off, to help suit your server!\n\nThe features are: `word-filter` ~~and `ghost-ping`",
	usage: '<feature>',
	permissions: ["administrator"],
	arguments: 1,
	async execute(message, args, prefix, client, firestore) {

		if(args[0] == "word-filter") {
			disable.get('wordFilter').execute(message, args, prefix, client, firestore);
		}
		else if(args[0] == "ghost-ping") {
			disable.get('ghostPing').execute(message, args, prefix, client, firestore);
		}

		else {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `That is not a valid feature! To view the features do \`${prefix}help disable\`` });
		}
	}
};
