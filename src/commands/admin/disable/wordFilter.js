module.exports = {
	name: 'wordFilter',
	permissions: ["administrator"],
	async execute(message, args, prefix, client, firestore) {

		await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
			wordFilter: {
				on: false
			}
		});
		message.reply('The `word-filter` has been turned off.');
	}
};
