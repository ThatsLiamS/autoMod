// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'purge',
	description: 'Mass delete messages',
	usage: '/purge <amount>',

	permissions: ['Manage Messages'],
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Mass deletes messages')

		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild)

		.addIntegerOption(option => option
			.setName('amount').setDescription('How many messages do I delete').setMinValue(1).setMaxValue(100).setRequired(true),
		),

	cooldown: { time: 10, text: '10 seconds' },
	defer: { defer: true, ephemeral: false },

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {

		/* Fetch the amount to delete */
		const number = Number(interaction.options.getInteger('amount'));

		/* Attempts to delete the messages */
		interaction.channel.bulkDelete(number, true)
			.then(m => interaction.followUp({ content: `Deleted **${m.size}** messages.`, ephemeral: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error occurred when deleting the messages:\nplease check my permissions.', ephemeral: true }));

		return true;

	},
};
