const { EmbedBuilder } = require('discord.js');
const GhostPing = require('discord.js-ghost-ping');

module.exports = {
	name: 'messageDelete',
	once: false,

	execute: async (message) => {

		if (message?.author?.bot == true || !message?.author?.bot) return false;

		/* Ghost Ping Detector */
		const res = GhostPing('messageDelete', message);
		if (res && res?.mentions) {
			const embed = new EmbedBuilder()
				.setTitle('Ghost Ping Detected')
				.setColor('White')
				.addFields(
					{ name: '__Who?__', value: `**Author:** ${res.author}\n**Channel:** ${res.channel}`, inline: true },
					{ name: '__Mentions__', value: `${res.mentions.join(' ')}!`, inline: true },
				)
				.setFooter({ text: 'Use this feature at:\nhttps://www.npmjs.com/package/discord.js-ghost-ping' })
				.setTimestamp();

			message.channel.send({ embeds: [embed] });
		}

	},
};
