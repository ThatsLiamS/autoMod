module.exports = {
	name: 'lock',
	description: 'Locks the ticket to staff only',

	error: false,
	execute: async ({ interaction, client }) => {
		await interaction.deferReply();

		const id = interaction.channel.topic.split(' ')[1];
		const user = await client.users.fetch(id);

		await interaction.channel.permissionOverwrites.create(user, {
			SEND_MESSAGES: false,
			ADD_REACTIONS: false,
			READ_MESSAGE_HISTORY: false,
			VIEW_CHANNEL: false,
		});

		interaction.followUp({ content: 'Ticket has been locked to staff only.', ephemeral: false });

	},
};
