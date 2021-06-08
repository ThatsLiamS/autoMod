const Discord = require('discord.js');

const fs = require('fs');
let enable = new Discord.Collection();
const files = fs.readdirSync(`${__dirname}/enable/`).filter(File => File.endsWith('.js'));
for (const file of files) {
	const fileinfo = require(`${__dirname}/enable/${file}`);
	enable.set(fileinfo.name, fileinfo);
}

module.exports = {
	name: 'enable',
	description: "Provides the ability to toggle certain features on, to help suit your server!\n\nThe features are: `word-filter` and `ghost-ping`",
	usage: '<feature> <channel>',
	permissions: ['administrator'],
	arguments: 2,
	async execute(message, args, prefix, client, firestore) {

		if(args[0] == "word-filter") {
			enable.get('wordFilter').execute(message, args, prefix, client, firestore);
		}
		else if(args[0] == "ghost-ping") {
			enable.get('ghostPing').execute(message, args, prefix, client, firestore);
		}

		else {
			return message.reply(`That is not a valid feature! To view the features do \`${prefix}help enable\``).catch();
		}
	}
};