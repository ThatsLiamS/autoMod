const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'purge',
	description: 'Mass delete messages',
	usage: '<amount>',

	permissions: ['Manage Messages'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Mass deletes messages')
		.addIntegerOption(option => option
			.setName('amount').setDescription('How many messages do I delete')
			.setMinValue(1).setMaxValue(100)
			.setRequired(true),
		),

	error: false,
	execute: async ({ interaction }) => {

		const number = Number(interaction.options.getInteger('amount'));

		interaction.channel.bulkDelete(number, true)
			.then(m => interaction.followUp({ content: `Deleted **${m.size}** messages.`, ephemeral: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error occurred when deleting the messages:\nplease check my permissions.', ephemeral: true }));

	},
};
