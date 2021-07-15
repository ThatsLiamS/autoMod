const Discord = require('discord.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild, client, firestore) {

		const channel = client.channels.cache.get(process.env.VoiceServerCounter);
		channel.setName(`Servers: ${client.guilds.cache.size}`).catch(() => {
			let channel1 = client.channels.cache.get(process.env.SupportReportID);
			channel1.send("Unable to rename the **Servers:** channel");
		});

		let owner = await client.users.fetch(guild.ownerID);
		if(!owner) { owner = guild.OwnerID; }

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`${client.user.tag} Joined A Server`)
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: '**Which?**', value: `${guild.name}`, inline: true },
				{ name: '**ID**', value: `${guild.id}`, inline: true },
				{ name: '**Owner**', value: `${owner}`, inline: true },
				{ name: '**Members**', value: `${guild.memberCount}`, inline: true },
				{ name: '**Created**', value: `${guild.createdAt}`, inline: true },
			)
			.setTimestamp();

		client.channels.cache.get(`${process.env.SupportServerlogID}`).send(embed);

		const Ref = await firestore.collection(`servers`).doc(`${guild.id}`).get();
		if (!Ref.data()) {
			await firestore.collection(`servers`).doc(`${guild.id}`).set({
				guild: guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
			});
		}
	}
};