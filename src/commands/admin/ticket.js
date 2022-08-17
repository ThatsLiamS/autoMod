const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const defaultData = require('./../../utils/defaults.js').guilds;

module.exports = {
	name: 'ticket',
	description: 'Sets up the ticket system',
	usage: '`/ticket setup <category> <channel> <role>`\n`/ticket logs <channel> <boolean>`\n`/ticket disable`\n`/ticket enable`',

	permissions: ['Administrator'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Contains all the tickets sub-commands!')
		.setDMPermission(false)

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
			.addStringOption(option => option.setName('enabled').setDescription('Turn it on or off?').setRequired(true).addChoices(
				{ name: 'Enable Logs', value: 'true' }, { name: 'Disable Logs', value: 'false' })),
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
	execute: async ({ interaction, firestore }) => {

		/* Which command was run */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const guildData = collection.data() || defaultData;

		if (subCommandName == 'setup') {

			/* Define command arguments */
			const category = interaction.options.getChannel('category');
			const channel = interaction.options.getChannel('channel');
			const role = interaction.options.getRole('role');

			/* Set the data */
			guildData.tickets.category = category.id;
			guildData.tickets.role = role.id;

			/* Send the ticketCreate message */
			const ticketCreate = new EmbedBuilder()
				.setTitle(`${interaction.guild.name} | Support`)
				.setColor('Green')
				.setDescription(`Create a ticket below to speak privately to <@&${role.id}> and our staff team. Abuse or spam tickets will be dealt with accordingly.`);
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder().setLabel('Create Ticket').setStyle(ButtonStyle.Success).setCustomId('tickets-create'),
			]);

			/* Send the ticketCreate message */
			if (!channel || (channel?.type != 0 && channel?.type != 5)) {
				interaction.followUp({ content: 'Please mention a valid __**text**__ channel.' });
				return false;
			}
			channel.send({ embeds: [ticketCreate], components: [row] });

			/* Reply to the message */
			const embed = new EmbedBuilder()
				.setTitle('Ticket System fully set up!')
				.setColor('Green')
				.setDescription(`The **Ticket System** has been set up to <#${category.id}>. Use the \`/ticket enable\` command to turn it on.`);
			interaction.followUp({ embeds: [embed] });
		}

		if (subCommandName == 'logs') {

			/* Define command arguments */
			const channel = interaction.options.getChannel('channel');
			const enabled = interaction.options.getString('enabled') == 'true' ? true : false;

			/* Is the channel valid */
			if (!channel || (channel?.type != 0 && channel?.type != 5)) {
				interaction.followUp({ content: 'Please mention a valid __**text**__ channel.' });
				return false;
			}

			/* Set the data */
			guildData.tickets.logs.active = enabled;
			guildData.tickets.logs.channel = channel.id;

			/* Reply to the message */
			interaction.followUp({ content: `The **Ticket Logs** have been set to ${enabled} in <#${channel.id}>` });
		}

		if (subCommandName == 'enable') {

			if (guildData.tickets.active == true) {
				interaction.followUp({ content: 'The **Ticket System** is already enabled.' });
				return false;
			}

			guildData.tickets.active = true;
			interaction.followUp({ content: 'The **Ticket System** has been enabled.' });
		}

		if (subCommandName == 'disable') {

			if (guildData.tickets.active == false) {
				interaction.followUp({ content: 'The **Ticket System** is already disabled.' });
				return false;
			}

			guildData.tickets.active = false;
			interaction.followUp({ content: 'The **Ticket System** has been disabled.' });
		}

		/* Save the newly set data */
		await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);

		/* Return successfully to start cooldown */
		return true;
	},
};
