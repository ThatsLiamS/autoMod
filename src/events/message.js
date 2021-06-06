const { wordFilter } = require(`${__dirname}/../util/wordFilter`);
const { logs } = require(`${__dirname}/../util/developer/test`);

const prefix = '!';

module.exports = {
	name: 'message',
	async execute(message, client, firestore) {
		if (!message.author.bot && message.guild === null) { return; }

		let error = false;
		if(message.content.startsWith(prefix)) {
			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const command = args.shift().toLowerCase();
			if (command.length !== 0) {
				const cmd = client.commands.get(command) || client.commands.find(file => file.aliases && file.aliases.includes(command));
				if (cmd) {

					if(cmd.permissions) {
						await cmd.permissions.forEach(permission => {
							if(!message.member.hasPermission(permission.trim().toUpperCase().replace(" ", "_")) && !message.member.hasPermission('ADMINISTRATOR')) {
								message.channel.send(`You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\``);
								error = true;
							}
						});
					}

					if(cmd.arguments) {
						const number = cmd.arguments;
						if(number >= 1) {
							if(!args[number - 1]) {
								message.channel.send(`Incorrect usage, make sure it follows the format: \`${prefix}${cmd.name} ${cmd.usage}\``);
								error = true;
							}
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