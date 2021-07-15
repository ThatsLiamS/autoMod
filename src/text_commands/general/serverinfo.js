const Discord = require('discord.js');
const moment = require('moment');

const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'serverinfo',
	description: 'Displays lots of cool information about the server!',
	aliases: ["server"],
	arguments: 0,
	async execute(message,) {
		const member = message.member;

		let owner = await message.guild.members.cache.get(message.guild.ownerID);
		if(!owner) { owner = message.guild.ownerID; }

		const serverEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${message.guild.name}'s Information`)
			.setThumbnail(message.member.guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: '**Server Name**', value: `${message.guild.name}`, inline: true },
				{ name: '**Server ID**', value: `${message.guild.id}`, inline: true },
				{ name: '**Server Owner**', value: `${owner}`, inline: true },
				{ name: '**Total Members**', value: `${message.guild.memberCount}`, inline: true },
				{ name: '**Created**', value: `${moment(message.guild.createdAt).format("DD/MM/YYYY LTS") }`, inline: true },
				{ name: '**Highest Role**', value: `${message.guild.roles.highest}`, inline: true }
			)
			.setTimestamp()
			.setFooter(`Requested By ${member.user.tag}`);

		await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [serverEmbed] });
	}
};