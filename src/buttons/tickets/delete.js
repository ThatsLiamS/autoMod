module.exports = {
	name: 'delete',
	description: 'Deletes the ticket channel',

	error: false,
	execute: async ({ interaction }) => {
		await interaction.reply({ content: 'This channel will be deleted shortly.' });

		interaction.channel.delete()
			.catch(() => {
				interaction.followUp({ content: 'I am unable to delete this ticket: do **not** manually delete it.\nCheck my permissions and try again.' });
			});

	},
};
