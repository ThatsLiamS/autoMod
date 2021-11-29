const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'disable',
	description: 'Toggle off some of my features.',
	usage: '<feature>',

	permissions: ['Administrator'],
	ownerOnly: false,

	options: [
		{ name: 'feature', description: 'Select which feature to disable', type: 'STRING', choices: [
			{ name: 'Ghost Ping detector', value: 'ghostping' },
			{ name: 'Moderation Logs', value: 'logs' },
		], required: true },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {
		await interaction.deferReply();

		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const serverData = collection.data() || defaultData['guilds'];

		const feature = interaction.options.getString('feature');

		if (feature == 'ghostping') {
			serverData['ghost ping']['on'] = false;
		}
		if (feature == 'logs') {
			serverData['logs']['on'] = false;
		}

		await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);
		interaction.followUp({ content: 'The feature has been disabled.' });

	},
};
