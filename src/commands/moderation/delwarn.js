const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'delwarn',
	description: 'Removes a moderation action against a user.',
	usage: '<user> [reason]',

	permissions: ['Kick Members'],
	ownerOnly: false,

	options: [
		{ name: 'user', description: 'User\'s Discord ID', type: 'STRING', required: true },
		{ name: 'case', description: 'Case number of the action', type: 'STRING', required: true },
	],

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id).catch(() => { return; });
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

		interaction.followUp({ content: 'That action has been deleted.', ephermal: true });

	},
};
