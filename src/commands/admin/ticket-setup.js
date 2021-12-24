const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const defaultData = require('../../utils/defaults');

module.exports = {
	name: 'ticket-setup',
	description: 'Set up the ticket system',
	usage: '<channel> <logs channel> <ticket category>',

	permissions: ['Administrator'],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'channel', description: 'Where members can open new tickets', type: 'CHANNEL', required: true },
		{ name: 'description', description: 'Description of the embed', type: 'STRING', required: true },
		{ name: 'logs', description: 'Channel where logs of created and closed tickets will be sent', type: 'CHANNEL', required: true },
		{ name: 'category', description: 'Category for tickets to be created in', type: 'CHANNEL', required: true },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {

		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const guildData = collection.data() || defaultData['guilds'];


		const channel = interaction.options.getChannel('channel');

		const embed = new MessageEmbed()
			.setTitle('Open a ticket!')
			.setColor('GREEN')
			.setDescription(interaction.options.getString('description'));

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('SUCCESS').setEmoji('📩').setLabel('Open Ticket').setCustomId('tickets-create'),
			);
		channel.send({ embeds: [embed], components: [row] });


		const logs = interaction.options.getChannel('logs');
		const category = interaction.options.getChannel('category');

		guildData.tickets.on = true;
		guildData.tickets.logs = logs.id;
		guildData.tickets.category = category.id;

		await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);
		interaction.followUp({ content: 'Tickets have been set up.' });

	},
};
