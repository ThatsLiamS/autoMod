const { wordFilter } = require(`${__dirname}/../util/wordFilter`);
const { logs } = require(`${__dirname}/../util/developer/test`);
const send = require(`${__dirname}/../util/send`);

const prefix = '!';
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
	name: 'messageCreate',
	async execute(message, client, firestore) {
		if (!message.author.bot && message.guild === null) { return; }

		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
		if (prefixRegex.test(message.content)) {

			const [, matchedPrefix] = message.content.match(prefixRegex);
			const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();

			if(!commandName) {
				if(!message.content.startsWith(prefix)) {
					client.text_commands.get('about').execute(message, args, prefix, client);
				}
			}

			if (commandName.length !== 0) {
				const cmd = client.text_commands.get(commandName)
					|| client.text_commands.find(file => file.aliases && file.aliases.includes(commandName));

				if (cmd) {
					let allowed = true;

					if(cmd.error && cmd.error == true) {
						allowed = false;
						await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, this command is currently out of order. Please try again later!' });
					}

					if(cmd.permissions && allowed === true) {
						for(const permission of cmd.permissions) {
							if(allowed === true
								&& !message.member.permissions.has(permission.trim().toUpperCase().replace(" ", "_"))
								&& !message.member.permissions.has('ADMINISTRATOR')) {

								await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
								allowed = false;
							}
						}
					}

					if(cmd.arguments && allowed === true) {
						const number = cmd.arguments;
						if(number >= 1) {
							if(!args[number - 1]) {
								await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}${cmd.name} ${cmd.usage}\`` });
								allowed = false;
							}
						}
					}

					if(cmd.ownerOnly && allowed === true) {
						if(message.author.id !== message.guild.ownerID) {
							await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
							allowed = false;
						}
					}

					if(cmd.developerOnly && allowed === true) {
						if(message.author.id !== '732667572448657539') {
							await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. Only the developer can run this command.` });
							allowed = false;
						}
					}

					if(allowed == true) {

						let Ref = await firestore.collection(`servers`).doc(`${message.guild.id}`).get();
						if (!Ref.data()) {
							await firestore.collection(`servers`).doc(`${message.guild.id}`).set({
								guild: message.guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
							});
						}

						cmd.execute(message, args, prefix, client, firestore);
						logs(client, message, `${commandName}: Text Command`);

					}
				}
			}
		}
		wordFilter(message, firestore);
	}
};