const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const defaultData = require('./../../utils/defaults.js').guilds;

module.exports = {
	name: 'close',
	description: 'Closes the ticket, only staff can view',

	error: false,
	execute: async ({ interaction, firestore, client }) => {
		await interaction.deferReply();

		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const guildData = collection.data() || defaultData;

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

		const logs = interaction.guild.channels.cache.get(guildData.tickets.logs);
		const embed = new EmbedBuilder()
			.setTitle('Ticket Closure')
			.setColor('Red')
			.setDescription(`${user.tag}'s ticket has been closed by ${interaction.user.username}`)
			.setFooter({ text: `${user.tag} (${user.id})` });

		logs.send({ embeds: [embed] });

		guildData.tickets.active = guildData.tickets.active.filter(m => m != user.id);
		await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);

		interaction.followUp({ components: [row], content: 'Ticket has been locked to staff only.\nReact with 🛑 to delete the ticket.', ephemeral: false });

	},
};
