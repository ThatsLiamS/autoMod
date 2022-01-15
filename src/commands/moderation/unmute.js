const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'unmute',
	description: 'Removes a temporary timeout for a user.',
	usage: '<user> [reason]',

	permissions: ['Time Out Members'],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'user', description: 'Who do you want to unmute?', type: 'USER', required: true },
		{ name: 'reason', description: 'Why?', type: 'STRING', required: false },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {

		const member = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		member.timeout(null, reason)
			.then(async () => {

				const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
				const serverData = collection.data() || defaultData['guilds'];

				if (!serverData['moderation logs'][member.id]) serverData['moderation logs'][member.id] = [];
				serverData['moderation logs']['case'] = Number(serverData['moderation logs']['case']) + 1;

				const object = {
					type: 'unmute',
					case: serverData['moderation logs']['case'],
					reason: reason,

					username: member.user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				serverData['moderation logs'][member.id] = [object].concat(serverData['moderation logs'][member.id]);
				await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);


				interaction.followUp({ content: `${member.user.tag} has been unmuted.`, ephemeral: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

	},
};