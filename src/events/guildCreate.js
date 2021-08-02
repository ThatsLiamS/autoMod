const Discord = require('discord.js');
const moment = require('moment');

const config = require(`${__dirname}/../../config`);

module.exports = {
	name: 'guildCreate',
	async execute(guild, client, firestore) {

		const owner = await guild.fetchOwner();

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`${client.user.tag} Joined A Server`)
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: '**Which?**', value: `${guild.name}`, inline: true },
				{ name: '**ID**', value: `${guild.id}`, inline: true },
				{ name: '**Owner**', value: `${owner}`, inline: true },
				{ name: '**Members**', value: `${guild.memberCount}`, inline: true },
				{ name: '**Created**', value: `${moment(guild.createdAt).format("DD/MM/YYYY LTS")}`, inline: true },
			)
			.setTimestamp();

		client.channels.cache.get(`${config.channels.logs.servers}`).send({ embeds: [embed] });

		const Ref = await firestore.collection(`servers`).doc(`${guild.id}`).get();
		if (!Ref.data()) {
			await firestore.collection(`servers`).doc(`${guild.id}`).set({
				guild: guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
			});
		}
	}
};