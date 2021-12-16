const { MessageEmbed } = require('discord.js');
const defaultData = require('./../utils/defaults').guilds;

module.exports = {
	name: 'messageUpdate',
	once: false,

	execute: async (oldMessage, newMessage, client, firestore) => {
		if (oldMessage.author.bot == true) return;


		/* Ghost Ping Detector */
		if (!oldMessage.mentions.members.size == 0 || !oldMessage.mentions.roles.size == 0) {

			const oldArray = [];
			oldMessage.mentions.members.forEach((member) => {
				if (!member.user.bot && member.id != oldMessage.author.id) oldArray.push(member.toString());
			});
			oldMessage.mentions.roles.forEach((role) => oldArray.push(role.toString()));

			const newArray = [];
			newMessage.mentions.members.forEach((member) => {
				if (!member.user.bot && member.id != oldMessage.author.id) newArray.push(member.toString());
			});
			newMessage.mentions.roles.forEach((role) => newArray.push(role.toString()));

			const mentions = oldArray.filter(r => !newArray.includes(r));
			if (mentions != []) {

				const embed = new MessageEmbed()
					.setTitle('Ghost Ping Detected')
					.setColor('#C0C0C0')
					.addFields(
						{ name: '__Who?__', value: `**Author:** ${oldMessage.author}\n**Channel:** ${oldMessage.channel}`, inline: true },
						{ name: '__Mentions__', value: `${mentions.join(' ')}!`, inline: true },
					)
					.setFooter('Do not ghost ping, that\'s mean.')
					.setTimestamp();

				const collection = await firestore.collection('guilds').doc(oldMessage.guild.id).get();
				const userData = collection.data() || defaultData;

				if (userData['ghost ping']['on'] == true) {

					const channel = client.channels.cache.get(userData['ghost ping']['channel']);
					channel.send({ embeds: [embed] });

				}
			}
		}


	},
};
