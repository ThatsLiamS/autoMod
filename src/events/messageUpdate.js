const { MessageEmbed } = require('discord.js');
const { filter, validate } = require('./../utils/ghostping');

const defaultData = require('./../utils/defaults').guilds;

module.exports = {
	name: 'messageUpdate',
	once: false,

	execute: async (oldMessage, newMessage, client, firestore) => {
		if (oldMessage.author.bot == true) return;


		/* Ghost Ping Detector */
		if (oldMessage.mentions.members.size !== 0 || oldMessage.mentions.roles.size !== 0) {

			let oldArray = oldMessage.mentions.members.map(member => validate(member, newMessage));
			oldArray = [...oldMessage.mentions.roles.map(x => filter(x)), ...oldArray];

			let newArray = newMessage.mentions.members.map(member => validate(member, newMessage));
			newArray = [...newMessage.mentions.roles.map(x => filter(x)), ...newArray];

			const mentions = oldArray.filter((mention) => !newArray.includes(mention) && mention.toString().startsWith('<'));
			if (mentions != []) {

				const collection = await firestore.collection('guilds').doc(oldMessage.guild.id).get();
				const userData = collection.data() || defaultData;

				if (userData['ghost ping']['on'] == true) {

					const embed = new MessageEmbed()
						.setTitle('Ghost Ping Detected')
						.setColor('#C0C0C0')
						.addFields(
							{ name: '__Who?__', value: `**Author:** ${oldMessage.author}\n**Channel:** ${oldMessage.channel}`, inline: true },
							{ name: '__Mentions__', value: `${mentions.join(' ')}!`, inline: true },
						)
						.setFooter({ text: 'Do not ghost ping, that\'s mean.' })
						.setTimestamp();

					const channel = client.channels.cache.get(userData['ghost ping']['channel']);
					channel.send({ embeds: [embed] });

				}
			}
		}


	},
};
