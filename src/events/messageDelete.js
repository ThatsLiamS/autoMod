const { detector } = require('discord.js-ghost-ping');

module.exports = {
	name: 'messageDelete',
	async execute(message) {

		detector("messageDelete", message).catch(() => {});

	}
};