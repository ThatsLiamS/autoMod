const send = require(`${__dirname}/../../../util/send`);
const mention = require(`${__dirname}/../../../util/mention`);

module.exports = {
	name: 'wordFilter',
	permissions: ["administrator"],
	async execute(message, args, prefix, client, firestore) {

		let channel = await mention.getChannel(message.guild, args[1]) || message.guild.channels.cache.get(args[1]);
		if(!channel) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Channel not found.` });
			return;
		}

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
