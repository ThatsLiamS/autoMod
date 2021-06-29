const { guildDelete } = require(`${__dirname}/../util/developer/test`);

module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {
		await guildDelete(guild, client);
	}
};