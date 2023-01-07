// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

module.exports = {
	name: 'kick',
	description: 'Kicks a member from the server.',
	usage: '`/kick <member> [reason]`',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kicks a user from the server.')
		.setDMPermission(false)

		.addStringOption(option => option.setName('member').setDescription('The member to kick - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are you kicking them?').setRequired(false)),

	cooldown: { time: 10, text: '10 seconds' },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {

		/* Fetch the target user */
		const userId = getUserId({ string: interaction.options.getString('member') });
		const member = interaction.guild.members.cache.get(userId);
		if (!member) {
			interaction.followUp({ content: 'I am unable to find that member.' });
			return;
		}
		/* Fetch the reason provided */
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';


		return interaction.guild.members.kick(member, `Mod: ${interaction.user.tag}\nReason: ${reason}`)
			.then(async () => {

				const guildData = await database.getValue(interaction.guild.id);
				if (!guildData.Moderation.cases[member.id]) guildData.Moderation.cases[member.id] = [];
				guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

				const object = {
					type: 'kick',
					case: guildData.Moderation.case,
					reason: reason,

					username: member.user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				/* Adds the log into the database */
				guildData.Moderation.cases[member.id] = [object].concat(guildData.Moderation.cases[member.id]);
				await database.setValue(interaction.guild.id, guildData);

				/* Sends an Embed logging this action */
				if (guildData.Moderation.logs.on == true) {
					const logEmbed = new EmbedBuilder()
						.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`🔨 Kicked: ${member.user.tag}`)
						.setColor('#DC143C')
						.addFields(
							{ name: '**User**', value: `${member.user.tag} (${member.user.id})`, inline: true },
							{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
							{ name: '**Reason**', value: `${reason}`, inline: false },
						)
						.setTimestamp();

					const channel = interaction.guild.channels.cache.get(guildData.Moderation.logs.channel);
					channel?.send({ embeds: [logEmbed] }).catch(() => false);
				}

				/* Responds to the moderator */
				interaction.followUp({ content: `${member.user.tag} has been kicked.`, ephemeral: true });
				return true;
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));
	},
};
