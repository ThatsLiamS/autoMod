const GhostPing = require('discord.js-ghost-ping');

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {
		try{
			GhostPing.detector("messageDelete", message);
		}
		catch(err) {
			client.error = true;
		}
	}
};