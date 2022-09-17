const { EmbedBuilder } = require('discord.js');
const { filter, validate } = require('./../utils/ghostping');

const defaultData = require('./../utils/defaults').guilds;

module.exports = {
	name: 'messageDelete',
	once: false,

	execute: async (message, client, firestore) => {

		if (message.partial) await message.fetch();
		if (message?.channel.partial) await message.channel.fetch();

		if (message?.author?.bot == true) return;

		/* Ghost Ping Detector */
		if (message?.mentions?.members?.size !== 0 || message?.mentions?.roles?.size !== 0) {

			if (message?.author?.bot || message?.mentions?.member?.size == 0 && message?.mentions?.roles?.size == 0) return false;

			let mentions = message.mentions.members.map(member => validate(member, message));
			mentions = [...message.mentions.roles.map(x => filter(x)), ...mentions];

			if (mentions != []) {

				const collection = await firestore.collection('guilds').doc(message.guild.id).get();
				const userData = collection.data() || defaultData;

				if (userData['ghost ping']['on'] == true) {

					const embed = new EmbedBuilder()
						.setTitle('Ghost Ping Detected')
						.setColor('#C0C0C0')
						.addFields(
							{ name: '__Who?__', value: `**Author:** ${message.author}\n**Channel:** ${message.channel}`, inline: true },
							{ name: '__Mentions__', value: `${mentions.join(' ')}!`, inline: true },
						)
						.setFooter({ text: 'Do not ghost ping, that\'s mean.' })
						.setTimestamp();

					const channel = client.channels.cache.get(userData['ghost ping']['channel']);
					if (!channel) return false;

					channel.send({ embeds: [embed] });

				}
			}
		}


	},
};
