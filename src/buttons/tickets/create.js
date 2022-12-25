const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { database } = require('../../utils/functions.js');

module.exports = {
	name: 'create',
	description: 'Opens a new ticket',

	error: false,
	execute: async ({ interaction }) => {
		await interaction.reply({ content: 'processing...', ephemeral: true });

		const guildData = await database.getValue(interaction.guild.id);

		if (guildData.Tickets.settings.on == false) {
			interaction.editReply({ content: 'Tickets have been disabled by the staff.', ephemeral: true });
			return;
		}

		if (guildData.Tickets.active.includes(interaction.user.id)) {
			interaction.editReply({ content: 'You already have an active ticket.', ephemeral: true });
			return;
		}

		const channel = await interaction.guild.channels.create(`ticket-${guildData.Tickets.case}`, {
			type: ChannelType.GuildText,
			topic: `${interaction.user.tag} ${interaction.user.id} | DO NOT MANUALLY DELETE`,
			parent: guildData.Tickets.settings.category,
			nsfw: false,
			reason: 'New ticket channel.',

			permissionOverwrites: [{
				id: interaction.user.id,
				allow: [
					PermissionsBitField.Flags.ViewChannel,
					PermissionsBitField.Flags.SendMessages,
					PermissionsBitField.Flags.ReadMessageHistory,
					PermissionsBitField.Flags.AddReactions,
				],
			}],
		});

		const embed = new EmbedBuilder()
			.setColor('Green')
			.setDescription('Thank you for opening a ticket, support will be with you shortly.\nTo close the ticket, react with a 🔒');

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary).setLabel('Close').setEmoji('🔒').setCustomId('tickets-close'),
			);

		channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
		interaction.editReply({ content: 'Your ticket has been created', ephemeral: true });

		const logs = interaction.guild.channels.cache.get(guildData.Tickets.settings.logs);
		const embed_log = new EmbedBuilder()
			.setTitle('Ticket Created')
			.setColor('Green')
			.setDescription(`${interaction.user.tag} has opened a ticket: ${channel}.`)
			.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });

		logs?.send({ embeds: [embed_log] }).catch(() => false);

		guildData.tickets.case = Number(guildData.tickets.case) + 1;
		guildData.tickets.active.push(interaction.user.id);

		await database.setValue(interaction.guild.id, guildData);

	},
};
