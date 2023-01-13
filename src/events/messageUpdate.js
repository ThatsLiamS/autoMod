// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder, Events } = require('discord.js');
const GhostPing = require('discord.js-ghost-ping');

module.exports = {
	name: Events.MessageUpdate,
	once: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Message} oldMessage The original Message
	 * @param {Message} newMessage The updated Message
	 * @returns {boolean}
	**/
	execute: async (oldMessage, newMessage) => {

		/* Fetch Partial Messages */
		if (oldMessage?.partial) await oldMessage.fetch();
		if (newMessage?.partial) await newMessage.fetch();

		if (oldMessage?.author?.bot == true || oldMessage?.author?.bot) return false;

		/* Ghost Ping Detector */
		const res = GhostPing('messageUpdate', oldMessage, newMessage);
		/* Has a GhostPing occured */
		if (res && res?.mentions) {
			const embed = new EmbedBuilder()
				.setTitle('Ghost Ping Detected')
				.setColor('White')
				.addFields(
					{ name: '__Who?__', value: `**Author:**   ${res.author}\n**Channel:** ${res.channel}`, inline: true },
					{ name: '__Mentions__', value: `${res.mentions.join(' ')}!`, inline: true },
				)
				.setFooter({ text: 'Don\'t GhostPing, smh!' })
				.setTimestamp();

			/* Sends the GhostPing message to the channel */
			newMessage.channel.send({ embeds: [embed] });
		}

		return true;

	},
};
