const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('../../utils/defaults');
const mention = require('../../utils/mentions.js');

module.exports = {
	name: 'history',
	description: 'Shows all moderation actions against a user.',
	usage: '`/history <user> [page]`',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Shows all moderation actions against a user.')
		.addStringOption(option => option.setName('user').setDescription('The user to fetch logs for - @mention or ID').setRequired(true))
		.addIntegerOption(option => option.setName('page').setDescription('Moderation log page to display').setMinValue(1).setRequired(false)),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const userId = mention.getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}

		const pageNumber = interaction.options.getInteger('page');

		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const serverData = collection.data() || defaultData['guilds'];

		if (serverData['moderation logs'][user.id] == undefined) {
			interaction.followUp({ content: 'That user has no recorded actions.' });
			return;
		}

		const pages = [];
		const pageData = [];

		for (let x = 0; x < serverData['moderation logs'][user.id].length; x += 10) {
			pageData.push(serverData['moderation logs'][user.id].slice(x, x + 10));
		}

		for (let x = 0; x < pageData.length; x++) {

			const embed = new MessageEmbed()
				.setTitle(`${user.username}'s logs`)
				.setColor('#DC143C')
				.setTimestamp()
				.setFooter({ text: `Page ${x}/${pageData.length}` });

			for (const action of pageData[x]) {
				embed.addFields({
					name: `__Case ${action.case}__`,
					value: `Type: ${action.type}\nReason: ${action.reason}\nModerator: ${action.moderator.username} (${action.moderator.id})`,
					inline: false,
				});
			}

			pages.push(embed);
		}

		const embed = pages[pageNumber - 1] ? pages[pageNumber - 1] : pages[0];
		interaction.followUp({ embeds: [embed], ephemeral: true });

	},
};
