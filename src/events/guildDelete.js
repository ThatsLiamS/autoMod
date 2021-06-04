const { guildDelete } = require(`${__dirname}/../util/developer/test`);

module.exports = {
	name: 'guildDelete',
	async execute(guild, client, firestore) {
		guildDelete(guild, firestore);
	}
};