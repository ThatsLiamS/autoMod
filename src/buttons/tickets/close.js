const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'close',
	description: 'Closes the ticket, only staff can view',

	error: false,
	execute: async ({ interaction, client }) => {
		await interaction.deferReply();

		const guildData = await database.getValue(interaction.guild.id);

		const id = interaction.channel.topic.split(' ')[1];
		const user = await client.users.fetch(id);

		await interaction.channel.permissionOverwrites.create(user, {
			SEND_MESSAGES: false,
			ADD_REACTIONS: false,
			READ_MESSAGE_HISTORY: false,
			VIEW_CHANNEL: false,
		});

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

		logs?.send({ embeds: [embed] }).catch(() => false);

		guildData.Tickets.active = guildData.Tickets.active.filter(m => m != user.id);
		await database.setValue(interaction.guild.id, guildData);

		interaction.followUp({ components: [row], content: 'Ticket has been locked to staff only.\nReact with 🛑 to delete the ticket.', ephemeral: false });

	},
};
