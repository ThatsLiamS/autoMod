const send = require(`${__dirname}/../../util/send`);
const Discord = require('discord.js');

module.exports = {
	name: 'say',
	description: 'Make autoMod repeat your sentence!',
	aliases: ["repeat"],
	usage: '<message>',
	arguments: 1,
	error: true,
	async execute(message, args) {

		const messageContent = Discord.Util.cleanContent(args.slice(0).join(" "), message);

		if(messageContent.length > 1900) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, your message was too long. I have a max of 2,000 chars.' });
			return;
		}

		await send.sendChannel({ channel: message.channel, author: message.author }, { content: `${messageContent}\n\n-  **${message.author.username}**` });
	}
};