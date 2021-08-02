const Discord = require('discord.js');
const moment = require('moment');

const config = require(`${__dirname}/../../config.json`);

module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {

		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle(`${client.user.tag} Left A Server`)
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: '**Which?**', value: `${guild.name}`, inline: true },
				{ name: '**ID**', value: `${guild.id}`, inline: true },
				{ name: '**Members**', value: `${guild.memberCount}`, inline: true },
				{ name: '**Created**', value: `${moment(guild.createdAt).format("DD/MM/YYYY LTS")}`, inline: true },
			)
			.setTimestamp();

		client.channels.cache.get(`${config.channels.logs.servers}`).send({ embeds: [embed] });

	}
};