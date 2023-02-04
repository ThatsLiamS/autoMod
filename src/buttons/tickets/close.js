// eslint-disable-next-line no-unused-vars
const { ButtonInteraction, Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'close',
	description: 'Closes the ticket, only staff can view',

	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {ButtonInteraction} arguments.interaction
	 * @param {Client} arguments.client
	 * @returns {Boolean}
	**/
	execute: async ({ interaction, client }) => {
		await interaction.deferReply();

		/* Fetch the Guild's Information */
		const guildData = await database.getValue(interaction.guild.id);

		const id = interaction.channel.topic.split(' ')[1];
		const user = await client.users.fetch(id);

		/* Remove the user from the channel */
		await interaction.channel.permissionOverwrites.create(user, {
			'SendMessages': false,
			'AddReactions': false,
			'ReadMessageHistory': false,
			'ViewChannel': false,
		});

		/* Allow the moderators to delete the channel */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger).setLabel('Delete').setEmoji('🛑').setCustomId('tickets-delete'),
			);

		const logs = interaction.guild.channels.cache.get(guildData.Tickets.settings.logs);
		const embed = new EmbedBuilder()
			.setTitle('Ticket Closure')
			.setColor('Red')
			.setDescription(`${user.tag}'s ticket has been closed by ${interaction.user.username}`)
			.setFooter({ text: `${user.tag} (${user.id})` });

		/* Send an embed logging this action */
		logs?.send({ embeds: [embed] }).catch(() => false);

		/* Set the value into the database */
		guildData.Tickets.active = guildData.Tickets.active.filter(m => m != user.id);
		await database.setValue(interaction.guild.id, guildData);

		/* Respond in the channel */
		interaction.followUp({ components: [row], content: 'Ticket has been locked to staff only.\nReact with 🛑 to delete the ticket.', ephemeral: false });

	},
};
