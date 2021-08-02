const Discord = require('discord.js');

module.exports = {
	name: 'enable',
	description: "Provides the ability to enable features.",
	options: [
		{ name: 'Feature', description: 'Select the feature to enable!', type: 'STRING', required: true, choices: [ { name: 'logs', value: 'logs' }, { name: 'word_filter', value: 'word_filter' }, ], },
		{ name: 'Channel', description: 'Select where the logs should go!', type: 'CHANNEL', required: true },
	],
	async execute(interaction, client, firestore) {

		await interaction.defer({ ephemeral: false });

		const feature = interaction.options.getString("Feature");
		const channel = interaction.options.getChannel("Channel");

		if(feature == 'logs') {

			await firestore.collection(`servers`).doc(`${interaction.guild.id}`).update({
				logs: {
					on: true,
					channel: channel.id,
				}
			});

			const Successful = new Discord.MessageEmbed()
				.setTitle('Logs successfully set')
				.setColor('GREEN')
				.setDescription(`All my moderation logs will now be sent to ${channel}`)
				.setFooter(`Requested by ${interaction.author.tag}`)
				.setTimestamp();

			interaction.followUp({ embeds: [Successful] });


		}
		if(feature == 'word_filter') {
			await firestore.collection(`servers`).doc(`${interaction.guild.id}`).update({
				wordFilter: {
					on: true,
					channel: channel.id,
				}
			});

			const Successful = new Discord.MessageEmbed()
				.setTitle('Word Filter has been enabled')
				.setColor('GREEN')
				.setDescription(`Successfully enabled the word filter, all infringements will be sent to ${channel}`)
				.setFooter(`Requested by ${interaction.author.tag}`)
				.setTimestamp();

			interaction.followUp({ embeds: [Successful] });
		}
		return;
	}
};