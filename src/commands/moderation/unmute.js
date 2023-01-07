// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder } = require('discord.js');
const { database, getUserId } = require('../../utils/functions.js');

module.exports = {
	name: 'unmute',
	description: 'Removes a temporary timeout for a user.',
	usage: '`/unmute <member> [reason]`',

	permissions: ['Moderator Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Removes a timeout to a user')
		.setDMPermission(false)

		.addStringOption(option => option.setName('member').setDescription('The member to unmute - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are we unmuting them?')),

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

		/* Fetch the target member */
		const userId = getUserId({ string: interaction.options.getString('member') });
		const member = interaction.guild.members.cache.get(userId);
		if (!member) {
			interaction.followUp({ content: 'I am unable to find that member.' });
			return;
		}
		/* Fetch the reason provided */
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		return member.timeout(null, reason)
			.then(async () => {

				/* Fetch the Guild's Moderation information */
				const guildData = await database.getValue(interaction.guild.id);
				if (!guildData.Moderation.cases[member.id]) guildData.Moderation.cases[member.id] = [];
				guildData.Moderation.case = Number(guildData.Moderation.case) + 1;

				const object = {
					type: 'unmute',
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

				/* Responds to the moderator */
				interaction.followUp({ content: `${member.user.tag} has been unmuted.`, ephemeral: true });
				return true;
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

	},
};
