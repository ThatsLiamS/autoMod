// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder } = require('discord.js');
const GhostPing = require('discord.js-ghost-ping');

module.exports = {
	name: 'messageDelete',
	once: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Message} message The message that was deleted
	 * @returns {boolean}
	**/
	execute: async (message) => {

		if (message?.author?.bot == true || message?.author?.bot) return false;

		/* Ghost Ping Detector */
		const res = GhostPing('messageDelete', message);
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
			message.channel.send({ embeds: [embed] });
		}

		return true;

	},
};
