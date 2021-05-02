const GhostPing = require('discord.js-ghost-ping');
module.exports = {
	name: 'messageDelete',
	async execute(message, client) {
		GhostPing.detector("messageDelete", message).catch(() => { });
	}
};
