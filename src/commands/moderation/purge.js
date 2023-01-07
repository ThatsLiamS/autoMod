const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'purge',
	description: 'Mass delete messages',
	usage: '/purge <amount>',

	permissions: ['Manage Messages'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Mass deletes messages')
		.setDMPermission(false)

		.addIntegerOption(option => option
			.setName('amount').setDescription('How many messages do I delete').setMinValue(1).setMaxValue(100).setRequired(true),
		),

	cooldown: { time: 10, text: '10 seconds' },
	defer: { defer: true, ephemeral: false },
	error: false,
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
