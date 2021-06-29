const send = require(`${__dirname}/../../../util/send`);

module.exports = {
	name: 'wordFilter',
	permissions: ["administrator"],
	async execute(message, args, prefix, client, firestore) {

		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
		if(!channel) return message.reply('Channel not found.');

		let level = 'soft';

		await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
			wordFilter: {
				on: true,
				channel: channel.id,
				level: level,
			}
		});
		await send.sendChannel({ channel: message.channel, author: message.author }, { content: `The word-filter has been turned on. All logs will be sent to ${channel}` });
	}
};
