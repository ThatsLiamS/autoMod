const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('./../../utils/defaults');
const mention = require('./../../utils/mentions.js');

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
		.addStringOption(option => option.setName('user').setDescription('The user to delete logs for - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('case').setDescription('Case number of the action').setRequired(true)),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const userId = mention.getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}

		const caseNumber = interaction.options.getString('case');

		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const serverData = collection.data() || defaultData['guilds'];

		if (serverData['moderation logs'][user.id] == undefined) {
			interaction.followUp({ content: 'That user has no recorded actions.' });
			return;
		}

		serverData['moderation logs'][user.id] = serverData['moderation logs'][user.id]
			.filter((doc) => (doc.case == caseNumber) == false);

		await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);

		interaction.followUp({ content: 'That action has been deleted.', ephemeral: true });

	},
};
