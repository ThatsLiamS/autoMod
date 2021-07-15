const Discord = require('discord.js');

module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {

		const channel = client.channels.cache.get(process.env.VoiceServerCounter);
		channel.setName(`Servers: ${client.guilds.cache.size}`).catch(() => {
			const channel1 = client.channels.cache.get(process.env.SupportReportID);
			channel1.send("Unable to rename the **Servers:** channel");
		});

		let owner = await client.users.fetch(guild.ownerID);
		if(!owner) { owner = guild.OwnerID; }

		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle(`${client.user.tag} Left A Server`)
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

	}
};