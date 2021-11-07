const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
	name: 'suggest',
	description: 'Suggest an improvement, command or feature!',
	usage: '<detailed description>',

	permissions: [],
	ownerOnly: false,

	options: [
		{ name: 'description', description: 'Include a detailed description of your suggestion.', type: 'STRING', required: true },
	],

	error: false,
	execute: ({ interaction, client }) => {

		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${interaction.options.getString('description')}`)
			.setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL())
			.setFooter(`ID: ${interaction.member.id}`)
			.setTimestamp();

		const webhook = new WebhookClient({ url: process.env['SuggestionWebhook'] });
		webhook.send({ username: interaction.guild.name, avatarURL, embeds: [embed] });

		interaction.reply({ content: 'Your suggestion has been sent to my developers.', ephemeral: true });
	},
};
