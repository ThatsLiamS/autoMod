const GhostPing = require('discord.js-ghost-ping');

module.exports = {
	name: 'messageDelete',
	async execute(message) {

		GhostPing.detector("messageDelete", message).catch(() => {});

	}
};