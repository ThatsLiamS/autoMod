const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'unmute',
	description: 'Removes a temporary timeout for a user.',
	usage: '<user> [reason]',

	permissions: ['Moderator Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Removes a timeout to a user')

		.addSubcommand(subcommand => subcommand
			.setName('by-user-id')
			.setDescription('Removes a timeout to a user')
			.addStringOption(option => option.setName('user').setDescription('The user ID to unmute').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are we unmuting them?')),
		)

		.addSubcommand(subcommand => subcommand
			.setName('by-user')
			.setDescription('Removes a timeout to a user')
			.addUserOption(option => option.setName('user').setDescription('The user to unmute').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are we unmuting them?')),
		),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const userId = interaction.options.getSubcommand() == 'by-user' ? interaction.options.getUser('user').id : interaction.options.getUser('user');
		const member = await client.users.fetch(userId).catch(() => { return; });
		if (!member) {
			interaction.followUp({ content: 'I am unable to find that user.' });
			return;
		}
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