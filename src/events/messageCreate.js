// eslint-disable-next-line no-unused-vars
const { Message, Events } = require('discord.js');
const emojis = require('./../utils/emojis');

module.exports = {
	name: Events.MessageCreate,
	once: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Message} Message The message object sent
	 * @returns {boolean}
	**/
	execute: async (message) => {

		/* Fetch message partials */
		if (message?.partial) await message.fetch();
		if (message?.channel?.partial) await message.channel.fetch();

		/* Suggestion Channel */
		if (message.channel.id == '821153396328366080') {
			await message.react(emojis.yes);
			await message.react(emojis.no);
		}

		/* Announcement Channel */
		if (message.channel.id == '821153011890913310') {
			await message.react('👍');
			await message.react(emojis.tada);
		}

		return true;
	},
};
