const emojis = require('./../utils/emojis');

module.exports = {
	name: 'messageCreate',
	once: false,

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

	},
};
