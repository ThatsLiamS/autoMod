// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { readdirSync } = require('fs');

const emojis = require('./../../utils/emojis');

module.exports = {
	name: 'help',
	description: 'Provides a list of all my commands!',
	usage: '`/help [command]`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides a list of all my commands!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('command').setDescription('Shows details about how to use a command').setRequired(false)),

	cooldown: { time: 0, text: 'None (0)' },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @param {Client} arguments.client
	 * @returns {Boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Did the user specify a command */
		const cmdName = interaction.options.getString('command');
		const cmd = client.commands.get(cmdName);

		if (cmd) {

			/* Builds the command specific information Embed */
			const embed = new EmbedBuilder()
				.setColor('#0099FF')
				.setTitle(cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1) + ' Command')
				.setURL('https://automod.liamskinner.co.uk/invite')
				.setDescription(cmd.description)
				.setTimestamp();

			embed.addFields({ name: '__Usage:__', value: (cmd.usage ? cmd.usage : '/ ' + cmd.name), inline: false });

			/* Add specific values and properties */
			if (cmd.permissions[0] && cmd.ownerOnly == false) {
				embed.addFields({ name: '__Permissions:__', value: '`' + cmd.permissions.join('` `') + '`', inline: false });
			}
			if (!cmd.permissions[0] && cmd.ownerOnly == true) {
				embed.addFields({ name: '__Permissions:__', value: '**Server Owner Only**', inline: false });
			}
			if (cmd.error == true) {
				embed.addFields({ name: '__Error:__', value: 'This command is currently unavailable, please try again later.', inline: false });
			}

			/* Responds to the user */
			interaction.followUp({ embeds: [embed], ephemeral: false });
			return true;

		}
		else {

			const embed = new EmbedBuilder()
				.setColor('#0099FF')
				.setTitle(client.user.username + ' Commands')
				.setURL('https://automod.liamskinner.co.uk/invite')
				.setDescription('To view the information about a certain command\ndo `/help <command>`.')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp();

			/* Filter through command files */
			for (const category of ['general', 'fun', 'moderation', 'admin', 'support']) {
				let description = '';

				const commandFiles = readdirSync(__dirname + '/../../commands/' + category).filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const command = require(`${__dirname}/../../commands/${category}/${file}`);
					description += `${command.usage}\n`;
				}

				/* Adds the categories information into the Embed */
				embed.addFields({ name: `__${category.charAt(0).toUpperCase() + category.slice(1)}__`, value: description, inline: false });
			}

			/* Creates LINK Buttons */
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link).setLabel('Support Server').setURL('https://automod.liamskinner.co.uk/support').setEmoji(emojis.link),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link).setLabel('Invite').setURL('https://automod.liamskinner.co.uk/invite').setEmoji(emojis.invite),
				);

			/* Responds to the user */
			interaction.followUp({ embeds: [embed], components: [row], ephemeral: false });
			return true;

		}

	},
};
