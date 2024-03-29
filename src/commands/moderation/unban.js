// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'unban',
	description: 'Unbans a member from the server.',
	usage: '/unban <user ID> [reason]',

	permissions: ['Ban Members'],
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a member from the server')

		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.ManageGuild)

		.addStringOption(option => option.setName('user').setDescription('The user ID to unban').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are we unbanning them?')),

	cooldown: { time: 10, text: '10 seconds' },
	defer: { defer: true, ephemeral: false },

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

		/* Fetch the target user */
		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id).catch(() => false);
		if (!user) {
			interaction.followUp({ content: 'Sorry, I can\'t find that user.' });
			return;
		}
		/* Fetch the reason provided */
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';


		return interaction.guild.members.unban(user, `Mod: ${interaction.user.tag}\nReason: ${reason}`)
			.then(async () => {

				/* Fetch the Guild's Moderation information */
				const guildData = await database.getValue(interaction.guild.id);
				if (!guildData.Moderation.cases[user.id]) guildData.Moderation.cases[user.id] = [];
				guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

				const object = {
					type: 'unban',
					case: guildData.Moderation.case,
					reason: reason,

					username: user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				/* Adds the log into the database */
				guildData.Moderation.cases[user.id] = [object].concat(guildData.Moderation.cases[user.id]);
				await database.setValue(interaction.guild.id, guildData);

				/* Sends an Embed logging this action */
				if (guildData.Moderation.logs.on == true) {
					const logEmbed = new EmbedBuilder()
						.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`Unbanned: ${user.tag}`)
						.setColor('Green')
						.addFields(
							{ name: '**User**', value: `${user.tag} (${user.id})`, inline: true },
							{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
							{ name: '**Reason**', value: `${reason}`, inline: false },
						)
						.setTimestamp();

					const channel = interaction.guild.channels.cache.get(guildData.Moderation.logs.channel);
					channel?.send({ embeds: [logEmbed] }).catch(() => false);
				}

				/* Responds to the moderator */
				interaction.followUp({ content: `${user.tag} has been unbanned.`, ephermal: true });
				return true;
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
