module.exports = {
	name: 'purge',
	description: 'Mass delete messages',
	usage: '<amount>',

	permissions: ['Manage Messages'],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'amount', description: 'How many messages do I delete?', type: 'INTEGER', required: true },
	],

	error: false,
	execute: async ({ interaction }) => {

		const number = Number(interaction.options.getInteger('amount'));

		if (number < 0 || number > 100) {
			interaction.followUp({ content: 'Please specify a number between 1 and 100.' });
			return;
		}

		interaction.channel.bulkDelete(number, true)
			.then(m => interaction.followUp({ content: `Deleted **${m.size}** messages.`, ephemeral: true }))
			.catch(() => interaction.followUp({ content: 'Sorry, an error occurred when deleting the messages:\nplease check my permissions.', ephemeral: true }));

	},
};
