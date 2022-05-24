const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const defaultData = require('./../../util/defaults.js').guilds;

module.exports = {
	name: 'create',
	description: 'Opens a new ticket',

	error: false,
	execute: async ({ interaction, firestore }) => {
		await interaction.reply({ content: 'processing...', ephemeral: true });

		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const guildData = collection.data() || defaultData;

		if (guildData.tickets.on == false) {
			interaction.editReply({ content: 'Tickets have been disabled by the staff.', ephemeral: true });
			return;
		}

		if (guildData.tickets.active.includes(interaction.user.id)) {
			interaction.editReply({ content: 'You already have an active ticket.', ephemeral: true });
			return;
		}

		const channel = await interaction.guild.channels.create(`ticket-${guildData.tickets.case}`, {
			type: 'GUILD_TEXT',
			topic: `${interaction.user.tag} ${interaction.user.id} | DO NOT MANUALLY DELETE`,
			parent: guildData.tickets.category,
			nsfw: false,
			reason: 'New ticket channel.',
		});
		await channel.permissionOverwrites.create(interaction.user, {
			SEND_MESSAGES: true,
			ADD_REACTIONS: true,
			READ_MESSAGE_HISTORY: true,
			VIEW_CHANNEL: true,
		});

		const embed = new MessageEmbed()
			.setColor('GREEN')
			.setDescription('Thank you for opening a ticket, support will be with you shortly.\nTo close the ticket, react with a 🔒');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('PRIMARY').setLabel('Close').setEmoji('🔒').setCustomId('tickets-close'),
			);

		channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
		interaction.editReply({ content: 'Your ticket has been created', ephemeral: true });

		const logs = interaction.guild.channels.cache.get(guildData.tickets.logs);
		const embed_log = new MessageEmbed()
			.setTitle('Ticket Created')
			.setColor('GREEN')
			.setDescription(`${interaction.user.tag} has opened a ticket: ${channel}.`)
			.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });

		logs.send({ embeds: [embed_log] });

		guildData.tickets.case = Number(guildData.tickets.case) + 1;
		guildData.tickets.active.push(interaction.user.id);

		await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);

	},
};