const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'ticket',
	description: 'Sets up the ticket system',
	usage: '`/ticket seup <category> <channel> <role>`\n`/ticket logs <channel> <enabled>`\n`/ticket enable`\n`/ticket disable`',

	permissions: ['Manage Guild'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Contains all the tickets sub-commands!')

		.addSubcommand(subcommand => subcommand
			.setName('setup')
			.setDescription('Sets up the ticket system')
			.addChannelOption(option => option.setName('category').setDescription('The ticket\'s parent category:').setRequired(true))
			.addChannelOption(option => option.setName('channel').setDescription('Where should users open tickets').setRequired(true))
			.addRoleOption(option => option.setName('role').setDescription('Which role should be able to handle tickets:').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('logs')
			.setDescription('Creates and enables ticket logs')
			.addChannelOption(option => option.setName('channel').setDescription('Where should the logs be sent:').setRequired(true))
			.addStringOption(option => option
				.setName('enabled').setDescription('Turn it on or off?')
				.addChoice('Enable Logs', true).addChoice('Disable Logs', false)
				.setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Enables the ticket system'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Disables the ticket system'),
		),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		const file = require(`./ticket/${subCommandName}`);
		await file.execute({ interaction, client, firestore });

	},
};
