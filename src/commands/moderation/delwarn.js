const { SlashCommandBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

module.exports = {
	name: 'delwarn',
	description: 'Removes a moderation action against a user.',
	usage: '`/dewarn <user> <case ID>`',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('delwarn')
		.setDescription('Removes a moderation action against a user.')
		.setDMPermission(false)

		.addStringOption(option => option.setName('user').setDescription('The user to delete logs for - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('case').setDescription('Case number of the action').setRequired(true)),

	cooldown: { time: 10, text: '10 seconds' },
	error: false,
	execute: async ({ interaction, client }) => {

		const userId = getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}

		const caseNumber = interaction.options.getString('case');
		const guildData = await database.getValue(interaction.guild.id);

		if (guildData.Moderation.cases[user.id] == undefined) {
			interaction.followUp({ content: 'That user has no recorded actions.' });
			return;
		}

		guildData.Moderation.cases[user.id] = guildData.Moderation.cases[user.id]
			.filter((doc) => (doc.case == caseNumber) == false);

		await database.setValue(interaction.guild.id, guildData);

		interaction.followUp({ content: 'That action has been deleted.', ephemeral: true });
		return true;

	},
};
