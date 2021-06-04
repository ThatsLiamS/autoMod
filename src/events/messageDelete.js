const GhostPing = require('discord.js-ghost-ping');

module.exports = {
	name: 'messageDelete',
	async execute(message) {
		try{
			GhostPing.detector("messageDelete", message);
		}
		catch(err) {
			console.log('');
		}
	}
};