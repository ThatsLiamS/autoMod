const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const defaultData = require('./../../utils/defaults.js');

module.exports = {
	name: 'modlogs',
	description: 'Sets up the moderation log system',
	usage: '`/modlogs setup <channel>`\n`/modlogs enable`\n`/modlogs disable`',

	permissions: ['Manage Guild'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('modlogs')
		.setDescription('Contains all the moderation log sub-commands!')
		.setDMPermission(false)

		.addSubcommand(subcommand => subcommand
			.setName('setup')
			.setDescription('Sets up the moderation log system')
			.addChannelOption(option => option.setName('channel').setDescription('Where should it be logged').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Enables the modlog system'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Disables the modlog system'),
		),

	error: false,
	execute: async ({ interaction, firestore }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const guildData = collection.data() || defaultData['guilds'];


		if (subCommandName == 'setup') {
			const channel = interaction.options.getChannel('channel');
			if (!channel || (channel?.type != 'GUILD_TEXT' && channel?.type != 'GUILD_NEWS')) {
				interaction.followUp({ content: 'Please mention a valid text channel.' });
				return false;
			}

			guildData['logs']['channel'] = channel.id;
			const embed = new EmbedBuilder()
				.setTitle('Successfully set up!')
				.setColor('Green')
				.setDescription(`The **Moderation Logs** have been set up to ${channel}. Use the \`/modlogs enable\` command to turn it on.`);

			interaction.followUp({ embeds: [embed] });
		}

		if (subCommandName == 'enable') {

			if (!guildData['logs']['channel'] || guildData['logs']['channel'] == '') {
				const embed = new EmbedBuilder()
					.setTitle('An error has occurred!')
					.setColor('Red')
					.setDescription('The **Moderation Logs** are required to be setup before being enabled. Please run the `/modlogs setup <channel>` command and try again.');

				interaction.followUp({ embeds: [embed] });
				return false;
			}

			if (guildData['logs']['on'] != true) {
				interaction.followUp({ content: 'The **Moderation Logs** are already enabled in this server.' });
				return false;
			}

			guildData['logs']['on'] = true;
			interaction.followUp({ content: 'The **Moderation Logs** have been enabled.' });
		}

		if (subCommandName == 'disable') {

			if (guildData['logs']['on'] != true) {
				interaction.followUp({ content: 'The **Moderation Logs** are already disabled in this server.' });
				return false;
			}

			guildData['logs']['on'] = false;
			interaction.followUp({ content: 'The **Moderation Logs** have been disabled.' });
		}

		await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);
		return true;

	},
};
