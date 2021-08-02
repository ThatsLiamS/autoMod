const Discord = require('discord.js');

module.exports = {
	name: 'disable',
	description: "Provides the ability to disable features.",
	options: [
		{ name: 'Feature', description: 'Select the feature to disable!', type: 'STRING', required: true, choices: [ { name: 'logs', value: 'logs' }, { name: 'word_filter', value: 'word_filter' }, ], },
	],
	async execute(interaction, client, firestore) {

		await interaction.defer({ ephemeral: false });

		const feature = interaction.options.getString("Feature");

		if(feature == 'logs') {

			await firestore.collection(`servers`).doc(`${interaction.guild.id}`).update({
				logs: {
					on: false,
				}
			});

			const Successful = new Discord.MessageEmbed()
				.setTitle('Logs successfully disabled')
				.setColor('RED')
				.setDescription(`I will no longer log moderation actions.`)
				.setFooter(`Requested by ${interaction.author.tag}`)
				.setTimestamp();

			interaction.followUp({ embeds: [Successful] });


		}
		if(feature == 'word_filter') {
			await firestore.collection(`servers`).doc(`${interaction.guild.id}`).update({
				wordFilter: {
					on: false,
				}
			});

			const Successful = new Discord.MessageEmbed()
				.setTitle('Word Filter has been disabled')
				.setColor('RED')
				.setFooter(`Requested by ${interaction.author.tag}`)
				.setTimestamp();

			interaction.followUp({ embeds: [Successful] });
		}
		return;
	}
};