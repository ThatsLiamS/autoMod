const { MessageEmbed } = require('discord.js');
const defaultData = require('./../utils/defaults').guilds;

module.exports = {
	name: 'messageDelete',
	once: false,

	execute: async (message, client, firestore) => {
		if (message.author.bot == true) return;


		/* Ghost Ping Detector */
		if (!message.mentions.members.size == 0 || !message.mentions.roles.size == 0) {

			const mentions = [];

			message.mentions.members.forEach((member) => {
				if (!member.user.bot && member.id != message.author.id) mentions.push(member.toString());
			});
			message.mentions.roles.forEach((role) => mentions.push(role.toString()));

			if (mentions != []) {

				const embed = new MessageEmbed()
					.setTitle('Ghost Ping Detected')
					.setColor('#C0C0C0')
					.addFields(
						{ name: '__Who?__', value: `**Author:** ${message.author}\n**Channel:** ${message.channel}`, inline: true },
						{ name: '__Mentions__', value: `${mentions.join(' ')}!`, inline: true },
					)
					.setFooter('Do not ghost ping, that\'s mean.')
					.setTimestamp();

				const collection = await firestore.collection('guilds').doc(message.guild.id).get();
				const userData = collection.data() || defaultData;

				if (userData['ghost ping']['on'] == true) {

					const channel = client.channels.cache.get(userData['ghost ping']['channel']);
					channel.send({ embeds: [embed] });

				}
			}
		}


	},
};
