const Discord = require('discord.js');

module.exports = {
	name: 'disable',
	description: "Provides the ability to disable features.",
	options: [
		{ name: 'feature', description: 'Select the feature to disable!', type: 'STRING', required: true, choices: [ { name: 'logs', value: 'logs' }, { name: 'word_filter', value: 'word_filter' }, ], },
	],
	permissions: ["administrator"],
	async execute(interaction, client, firestore) {

		await interaction.defer({ ephemeral: false });

		const feature = interaction.options.getString("feature");

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
				.setFooter(`Requested by ${interaction.member.user.username}`)
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
				.setFooter(`Requested by ${interaction.member.user.username}`)
				.setTimestamp();

			interaction.followUp({ embeds: [Successful] });
		}
		return;
	}
};