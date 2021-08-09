const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	description: "Displays lots of cool information about the user!",
	usage: '[user]',
	options: [
		{ name: 'member', description: 'Mention a member in the server', type: 'USER', required: false },
	],
	async execute(interaction) {
		await interaction.defer({ ephemeral: false });

		let target = interaction.options.getUser('member');
		let user = (target && target.id) ? interaction.guild.members.cache.get(target.id) : undefined;

		const member = user ? user : interaction.member;

		let roles = '';
		member.roles.cache.forEach(role => {
			if (role.name != "@everyone") { roles += ` ${role} `; }
		});
		if(roles.length < 1) { roles = "none"; }

		const embed = new Discord.MessageEmbed()
			.setTitle(`${member.user.tag}'s Info`)
			.setThumbnail(member.user.displayAvatarURL())
			.setColor('GREEN')
			.addFields(
				{ name: '**Username**', value: `${member.user.tag}`, inline: true },
				{ name: '**User ID**', value: `${member.user.id}`, inline: true },
				{ name: `**Account Ping**`, value: `${member}`, inline: true },
				{ name: '**Created**', value: `${moment(member.user.createdAt).format("DD/MM/YYYY LTS") }`, inline: true },
				{ name: '**Roles**', value: `${roles}`, inline: false }
			)
			.setTimestamp()
			.setFooter(`Requested By ${interaction.member.user.tag}`);

		await interaction.followUp({ embeds: [embed] });
	}
};