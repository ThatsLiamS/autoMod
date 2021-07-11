const Discord = require('discord.js');

const profanities = ["bastard", "cunt", "fanny", "shit", "bitch", "pussy", "wanker", "fuck", "nigger", "nigga", "gook", "niger", "dick", " cum", "penis", "vagina"];

async function wordFilter(message, firestore) {

	const contains = profanities.reduce((acc, res) => acc || message.content.toLowerCase().split(' ').includes(res), false);

	if(contains && contains == true) {
		let member = await message.member;

		let document = await firestore.collection(`servers`).doc(`${message.guild.id}`).get();
		if (!document.data()) {
			await firestore.collection(`servers`).doc(`${message.guild.id}`).set({
				guild: message.guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
			});
		}

		if(document.data().wordFilter.on == true) {
			message.delete().catch();
			message.channel.send(`${member}'s message was deleted`).catch(() => { message.author.send(`I saw your swear, Please refrain from this in the future.`); }).catch();

			const embed = new Discord.MessageEmbed()
				.setColor('#DC143C')
				.setTitle(`Inappropriate Language`)
				.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
				.setThumbnail(member.user.displayAvatarURL())
				.addFields(
					{ name: 'Author', value: `${member}`, inline: true },
					{ name: 'Message Content', value: `${message}`, inline: true },
				)
				.setTimestamp().setFooter(`Bot Created By @ThatsLiamS#6590`);

			const channel = message.guild.channels.cache.get(document.data().wordFilter.channel);
			if(!channel) { return message.channel.send('I could not find The logging channel.'); }

			channel.send(embed).catch(() => { message.channel.send(`I failed to log this in ${channel}`); }).catch();

		}
	}
}


module.exports = {
	wordFilter
};