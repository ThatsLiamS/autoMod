// eslint-disable-next-line no-unused-vars
const { ButtonInteraction } = require('discord.js');

module.exports = {
	name: 'delete',
	description: 'Deletes the ticket channel',

	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {ButtonInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {
		await interaction.reply({ content: 'This channel will be deleted shortly.' });

		/* Deletes the channel */
		interaction.channel.delete()
			.catch(() => {
				/* Woah, an error appeared */
				interaction.followUp({ content: 'I am unable to delete this ticket.\nYou **may manually** delete it.' });
			});

	},
};
