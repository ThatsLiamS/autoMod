const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'enable',
	description: 'Toggle on some of my features.',
	usage: '<feature>',

	permissions: ['Administrator'],
	ownerOnly: false,

	options: [
		{ name: 'feature', description: 'Select which feature to enable', type: 'STRING', choices: [
			{ name: 'Ghost Ping detector', value: 'ghostping' },
			{ name: 'Moderation Logs', value: 'logs' },
		], required: true },
		{ name: 'channel', description: 'Which channel should logs be sent?', type: 'CHANNEL', required: true },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {
		await interaction.deferReply();

		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const serverData = collection.data() || defaultData['guilds'];

		const feature = interaction.options.getString('feature');
		const channel = interaction.options.getChannel('channel');

		if (feature == 'ghostping') {
			serverData['ghost ping']['on'] = true;
			serverData['ghost ping']['channel'] = channel.id;
		}
		if (feature == 'logs') {
			serverData['logs']['on'] = true;
			serverData['logs']['channel'] = channel.id;
		}

		await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);
		interaction.followUp({ content: 'The feature has been enabled.' });

	},
};
