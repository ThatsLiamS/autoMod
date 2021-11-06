const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'whois',
	description: 'Shows information about a user',
	usage: '[user]',

	permissions: [],
	ownerOnly: false,

	options: [
		{ name: 'user', description: 'User to get information for', type: 'USER', required: false },
	],

	error: false,
	execute: async ({ interaction }) => {

		const member = interaction.options.getMember('user') || interaction.member;
		const user = await member.user.fetch(true);

		const ageTimestamp = new Date() - member.joinedTimestamp;
		const age = `${Math.floor(ageTimestamp / 86400000)}d ${Math.floor(ageTimestamp / 3600000) % 24}h ${Math.floor(ageTimestamp / 60000) % 60}m ${Math.floor(ageTimestamp / 1000) % 60}s`;

		const roles = [];
		member.roles.cache.forEach(r => roles.push(r));

		const embed = new MessageEmbed()
			.setColor(user.hexAccentColor)
			.setAuthor(interaction.member.user.username, interaction.member.displayAvatarURL())
			.setTitle(`${member.displayName}'s Information`)
			.setThumbnail(member.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: '**Username**', value: `${user.username}`, inline: true },
				{ name: '**User ID**', value: `${user.id}`, inline: true },
				{ name: '**Account Ping**', value: `${user}`, inline: true },

				{ name: '**Created At**', value: `${moment(user.createdAt).format('DD/MM/YYYY LTS')}`, inline: true },
				{ name: '**Joined At**', value: `${moment(member.joinedAt).format('DD/MM/YYYY LTS')}`, inline: true },
				{ name: '**Server Age**', value: `${age}`, inline: true },

				{ name: '**Roles**', value: `${roles.join(' ')}`, inline: false },
			)
			.setFooter(`Requested by ${interaction.member.user.tag}, ID ${interaction.member.id}`)
			.setTimestamp();

		interaction.reply({ embeds: [embed] });

	},
};
