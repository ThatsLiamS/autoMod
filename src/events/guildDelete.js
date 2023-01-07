// eslint-disable-next-line no-unused-vars
const { Guild, Client, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'guildDelete',
	once: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Guild} guild Discord Guild object
	 * @param {Client} client Discord Bot's Client
	 * @returns {boolean}
	**/
	execute: async (guild, client) => {
		if (!guild || !guild?.available) return false;

		/* Fetch the Owner's Information */
		const ownerId = guild?.ownerId;
		const user = ownerId ? await client.users.fetch(ownerId) : null;
		const owner = user ? user.username : ownerId;

		/* Creates the Embed Message of Information */
		const avatarURL = guild?.iconURL() ? guild?.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setTitle(`${client.user.username} - Left a Server!`)
			.addFields(
				{ name: 'Name', value: `${guild?.name}`, inline: true },
				{ name: 'ID', value: `${guild?.id}`, inline: true },
				{ name: 'Owner', value: `${owner || 'Unknown User'}`, inline: true },

				{ name: 'Member Count', value: `${guild?.memberCount} / ${guild.maximumMembers}`, inline: true },
				{ name: 'Created At', value: `${guild?.createdAt}`, inline: true },
				{ name: 'Location', value: `${guild?.preferredLocale || 'Unknown Location'}`, inline: true },
			)
			.setAuthor({ name: guild?.name, iconURL: avatarURL })
			.setFooter({ text: 'Filter keywords: Coin Flipper, guildDelete, Guild, Left, Delete' })
			.setTimestamp();

		/* Sends the webhook embed */
		const webhook = new WebhookClient({ url: process.env['DeveloperLogs'] });
		webhook.send({ username: client.user.username, avatarURL: client.user.displayAvatarURL(), embeds: [embed] });

		return true;
	},
};
