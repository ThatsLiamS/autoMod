const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'ghostping',
	description: 'Sets up the ghostping detection system',
	usage: '`/ghostping setup <channel>`\n`/ghostping enable`\n`/ghostping disable`',

	permissions: ['Manage Guild'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('ghostping')
		.setDescription('Contains all the ghostping sub-commands!')
		.setDMPermission(false)

		.addSubcommand(subcommand => subcommand
			.setName('setup')
			.setDescription('Sets up the ghostping detection system')
			.addChannelOption(option => option.setName('channel').setDescription('Where should it be logged').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Enables the ghostping detection system'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Disables the ghostping detection system'),
		),

	error: false,
	execute: async ({ interaction }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		const guildData = await database.getValue(interaction.guild.id);


		if (subCommandName == 'setup') {
			const channel = interaction.options.getChannel('channel');
			if (!channel || (channel?.type != 'GUILD_TEXT' && channel?.type != 'GUILD_NEWS')) {
				interaction.followUp({ content: 'Please mention a valid text channel.' });
				return false;
			}

			guildData.GhostPing.channel = channel.id;
			const embed = new EmbedBuilder()
				.setTitle('Successfully set up!')
				.setColor('Green')
				.setDescription(`The **Ghost Ping Detector** has been set up to ${channel}. Use the \`/ghostping enable\` command to turn it on.`);

			interaction.followUp({ embeds: [embed] });
		}

		if (subCommandName == 'enable') {

			if (!guildData.GhostPing.channel || guildData.GhostPing.channel == '') {
				const embed = new EmbedBuilder()
					.setTitle('An error has occurred!')
					.setColor('Red')
					.setDescription('The **Ghost Ping Detector** is required to be setup before being enabled. Please run the `/ghostping setup <channel>` command and try again.');

				interaction.followUp({ embeds: [embed] });
				return false;
			}

			if (guildData.GhostPing.on != true) {
				interaction.followUp({ content: 'The **Ghost Ping Detector** is already enabled in this server.' });
				return false;
			}

			guildData.GhostPing.on = true;
			interaction.followUp({ content: 'The **Ghost Ping Detector** has been enabled.' });
		}

		if (subCommandName == 'disable') {

			if (guildData.GhostPing.on != true) {
				interaction.followUp({ content: 'The **Ghost Ping Detector** is already disabled in this server.' });
				return false;
			}

			guildData.GhostPing.on = false;
			interaction.followUp({ content: 'The **Ghost Ping Detector** has been disabled.' });
		}

		await database.setValue(interaction.guild.id, guildData);
		return true;

	},
};
