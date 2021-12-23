const { MessageEmbed } = require('discord.js');
const defaultData = require('./../../utils/defaults.js');

module.exports = {
	name: 'delete',
	description: 'Deletes the ticket channel',

	error: false,
	execute: async ({ interaction, firestore, client }) => {
		await interaction.reply({ content: 'This channel will be deleted shortly.' });

		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const guildData = collection.data() || defaultData['guilds'];

		const id = interaction.channel.topic.split(' ')[1];
		const user = await client.users.fetch(id);

		const logs = interaction.guild.channels.cache.get(guildData.tickets.logs);
		const embed = new MessageEmbed()
			.setTitle('Ticket Closure')
			.setColor('RED')
			.setDescription(`${user.tag}'s ticket has been closed by ${interaction.user.username}`)
			.setFooter(`${user.tag} (${user.id})`);

		logs.send({ embeds: [embed] });

		interaction.channel.delete()
			.catch(() => {
				interaction.followUp({ content: 'I am unable to delete this ticket: do **not** manually delete it.\nCheck my permissions and try again.' });
			});

		guildData.tickets.active = guildData.tickets.active.filter(m => m != user.id);
		await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);

	},
};
