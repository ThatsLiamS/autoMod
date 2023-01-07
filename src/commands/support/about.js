// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { makeGrid } = require('../../utils/functions.js');

module.exports = {
	name: 'about',
	description: 'Shows lots of cool information about the bot!',
	usage: '`/about`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Shows lots of cool information about the bot!')
		.setDMPermission(false),

	cooldown: { time: 15, text: '15 seconds' },
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

		/* Gather stats from across ALL Shards */
		const promises = [
			client.shard.fetchClientValues('ws.ping'),
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(() => this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];
		const results = await Promise.all(promises);

		/* Formats the data into an Embed */
		const embed = new EmbedBuilder()
			.setTitle('My Information')
			.setColor('Green')
			.setDescription('Hey, I\'m **[autoMod#3828](https://automod.liamskinner.com/invite)**!\n```\n' + makeGrid(results) + '```')
			.addFields(
				{ name: '**Total Servers:**', value: results[1].reduce((acc, guildCount) => acc + guildCount, 0).toString(), inline: true },
				{ name: '**Total Users:**', value: results[2].reduce((acc, memberCount) => acc + memberCount, 0).toString(), inline: true },
				{ name: '**Total Commands:**', value: '32', inline: true },

				{ name: '**Uptime:**', value: `\`${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``, inline: true },
				{ name: '**Shard ID:**', value: `\`#${Number(interaction.guild.shardId) + 1} out of ${client.shard.count}\``, inline: true },
				{ name: '**Developer:**', value: '**[ThatsLiamS#6950](https://liamskinner.co.uk)**', inline: true },
			)
			.setFooter({ text: 'Do /help to get started.' });

		/* Responds to the user */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
