module.exports = {
	name: 'guildCreate',
	async execute(guild, client, firestore) {

		const Ref = await firestore.collection(`servers`).doc(`${guild.id}`).get();
		if (!Ref.data()) {
			await firestore.collection(`servers`).doc(`${guild.id}`).set({
				guild: guild.id,
				wordFilter: {
					on: false,
					channel: `n/a`,
					level: `soft`
				},
				ghostping: {
					on: false,
					everyone: false,
					logs: {
						on: false,
						channel: `n/a`
					}
				},
				welcome: {
					on: false,
					channel: `n/a`,
					embed: {
						title: `n/a`,
						message: `n/a`,
						color: `n/a`,
						footer: `n/a`
					}
				}, logs: {
					on: false,
					channel: `n/a`
				}
			});
		}
	}
};