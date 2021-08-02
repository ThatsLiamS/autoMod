const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'serverinfo',
	description: 'Displays lots of cool information about the server!',
	async execute(interaction) {
		await interaction.defer({ ephemeral: false });

		const owner = await interaction.guild.fetchOwner();

		const serverEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${interaction.guild.name}'s Information`)
			.setThumbnail(interaction.member.guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: '**Server Name**', value: `${interaction.guild.name}`, inline: true },
				{ name: '**Server ID**', value: `${interaction.guild.id}`, inline: true },
				{ name: '**Server Owner**', value: `${owner}`, inline: true },
				{ name: '**Total Members**', value: `${interaction.guild.memberCount}`, inline: true },
				{ name: '**Created**', value: `${moment(interaction.guild.createdAt).format("DD/MM/YYYY LTS") }`, inline: true },
				{ name: '**Highest Role**', value: `${interaction.guild.roles.highest}`, inline: true }
			)
			.setTimestamp()
			.setFooter(`Requested By ${interaction.member.user.tag}`);

		await interaction.followUp({ embeds: [serverEmbed] });
	}
};