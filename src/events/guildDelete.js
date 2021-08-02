const Discord = require('discord.js');

const config = require(`${__dirname}/../../config.json`);

module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {

		const owner = await guild.fetchOwner();

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

		client.channels.cache.get(`${config.channels.logs.servers}`).send({ embeds: [embed] });

	}
};