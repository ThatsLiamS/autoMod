const { wordFilter } = require(`${__dirname}/../util/wordFilter`);
const { logs } = require(`${__dirname}/../util/developer/test`);
const send = require(`${__dirname}/../util/send`);

const prefix = '!';
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
	name: 'message',
	async execute(message, client, firestore) {
		if (!message.author.bot && message.guild === null) { return; }

		let error = false;

		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
		if (prefixRegex.test(message.content)) {

			const [, matchedPrefix] = message.content.match(prefixRegex);
			const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();

			if(!command) {
				if(!message.content.startsWith(prefix)) {
					client.commands.get('about').execute(message, args, prefix, client);
				}
			}

			if (command.length !== 0) {
				const cmd = client.commands.get(command) || client.commands.find(file => file.aliases && file.aliases.includes(command));
				if (cmd) {

					if(cmd.error && cmd.error == true) {
						error = true;
						await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, this command is currently out of order. Please try again later!' });
					}

					if(cmd.permissions && error === false) {
						for(const permission of cmd.permissions) {
							if(error === false && !message.member.hasPermission(permission.trim().toUpperCase().replace(" ", "_")) && !message.member.hasPermission('ADMINISTRATOR') && error == false) {
								await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
								error = true;
							}
						}
					}

					if(cmd.arguments && error === false) {
						const number = cmd.arguments;
						if(number >= 1) {
							if(!args[number - 1]) {
								await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}${cmd.name} ${cmd.usage}\`` });
								error = true;
							}
						}
					}

					if(cmd.ownerOnly && error === false) {
						if(message.author.id !== message.guild.ownerID) {
							await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
							error = true;
						}
					}

					if(error == false) {

						let Ref = await firestore.collection(`servers`).doc(`${message.guild.id}`).get();
						if (!Ref.data()) {
							await firestore.collection(`servers`).doc(`${message.guild.id}`).set({
								guild: message.guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
							});
						}

						cmd.execute(message, args, prefix, client, firestore);
						logs(client, message, `${command} Command`);

					}
				}
			}
		}
		wordFilter(message, firestore);
	}
};