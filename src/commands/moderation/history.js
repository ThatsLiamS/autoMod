// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

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
		.setDMPermission(false)

		.addStringOption(option => option.setName('user').setDescription('The user to fetch logs for - @mention or ID').setRequired(true))
		.addIntegerOption(option => option.setName('page').setDescription('Moderation log page to display').setMinValue(1).setRequired(false)),

	cooldown: { time: 10, text: '10 seconds' },
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

		/* Fetch the target user */
		const userId = getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => false);
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}

		/* Fetch the Guild's Moderation information */
		const pageNumber = interaction.options.getInteger('page');
		const guildData = await database.getValue(interaction.guild.id);

		/* What if they're innocent? */
		if (guildData.Moderation.cases[user.id] == undefined) {
			interaction.followUp({ content: 'That user has no recorded actions.' });
			return;
		}

		/* Create the pages' data */
		const pages = [];
		const pageData = [];

		for (let x = 0; x < guildData.Moderation.cases[user.id].length; x += 10) {
			pageData.push(guildData.Moderation.cases[user.id].slice(x, x + 10));
		}

		/* Create the embeds for each page */
		for (let x = 0; x < pageData.length; x++) {

			const embed = new EmbedBuilder()
				.setTitle(`${user.username}'s logs`)
				.setColor('#DC143C')
				.setTimestamp()
				.setFooter({ text: `Page ${x}/${pageData.length}` });

			/* Loop through the selected moderation actions */
			for (const action of pageData[x]) {
				embed.addFields({
					name: `__Case ${action.case}__`,
					value: `Type: ${action.type}\nReason: ${action.reason}\nModerator: ${action.moderator.username} (${action.moderator.id})`,
					inline: false,
				});
			}

			pages.push(embed);
		}

		/* Responds to the moderator */
		const embed = pages[pageNumber - 1] ? pages[pageNumber - 1] : pages[0];
		interaction.followUp({ embeds: [embed], ephemeral: true });

		return true;

	},
};
