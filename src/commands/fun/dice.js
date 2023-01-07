// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'dice',
	description: 'Roll a 6 sided die!',
	usage: '/dice',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a 6 sided die!')
		.setDMPermission(true),

	cooldown: { time: 0, text: 'None (0)' },
	defer: { defer: true, ephemeral: true },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {

		/* Generate a random number */
		const random = Math.floor(Math.random() * 6) + 1;
		const embed = new EmbedBuilder()
			.setTitle('Dice roll')
			.setDescription(`You rolled a ${random}!`)
			.setThumbnail(`https://assets.liamskinner.co.uk/dice/${random}.png`);

		/* Responds to the user */
		interaction.followUp({ embeds: [embed], ephemeral: false });
		return true;

	},
};
