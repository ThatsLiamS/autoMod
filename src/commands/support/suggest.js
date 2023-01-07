// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'suggest',
	description: 'Suggest an improvement, command or feature!',
	usage: '/suggest <detailed description>',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggest an improvement, command or feature!')
		.setDMPermission(false)

		.addStringOption(option => option
			.setName('description').setDescription('Include a detailed description of your suggestion').setRequired(true),
		),

	cooldown: { time: 10 * 60, text: '10 minutes' },
	defer: { defer: true, ephemeral: true },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @param {Client} arguments.client
	 * @returns {Boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Creates the Webhook Embed to send */
		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${interaction.options.getString('description')}`)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setFooter({ text: `ID: ${interaction.member.id}` })
			.setTimestamp();

		/* Sends the webhook */
		const webhook = new WebhookClient({ url: process.env['SuggestionWebhook'] });
		webhook.send({ username: interaction.guild.name, avatarURL, embeds: [embed] });

		/* Responds to the user */
		interaction.followUp({ content: 'Your suggestion has been sent to my developers.', ephemeral: true });
		return true;
	},
};
