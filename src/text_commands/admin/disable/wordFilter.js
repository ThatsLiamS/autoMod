const send = require(`${__dirname}/../../../util/send`);

module.exports = {
	name: 'wordFilter',
	permissions: ["administrator"],
	async execute(message, args, prefix, client, firestore) {

		await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
			wordFilter: {
				on: false
			}
		});
		await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'The `word-filter` has been turned off.' });

	}
};
