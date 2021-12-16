const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
	name: 'report',
	description: 'Report a bug/issue to the developers!',
	usage: '<detailed description>',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'description', description: 'Explain the bug/issue in great detail.', type: 'STRING', required: true },
	],

	error: false,
	execute: ({ interaction, client }) => {

		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${interaction.options.getString('description')}`)
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
			.setFooter(`ID: ${interaction.member.id}`)
			.setTimestamp();

		const webhook = new WebhookClient({ url: process.env['ReportWebhook'] });
		webhook.send({ username: interaction.guild.name, avatarURL, embeds: [embed] });

		interaction.followUp({ content: 'Thank you for helping us make autoMod even better.', ephemeral: true });
	},
};
