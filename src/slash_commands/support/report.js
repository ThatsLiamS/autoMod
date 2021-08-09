const Discord = require('discord.js');

const config = require(`${__dirname}/../../../config`);

module.exports = {
	name: 'report',
	description: 'Submit a bug report to the Developers.',
	usage: '<detailed report>',
	options: [
		{ name: 'command', description: 'Where does the issue take place?', type: 'STRING', required: true },
		{ name: 'description', description: 'General explanation of the bug along with steps to reproduce.', type: 'STRING', required: true },
	],
	async execute(interaction, client) {

		await interaction.defer({ ephemeral: true });

		const description = interaction.options.getString("description");
		const command = interaction.options.getString("command");

		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setDescription(`**${command}**\n${description}`)
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setFooter(`ID: ${interaction.member.id}`)
			.setTimestamp();

		const channel = client.channels.cache.get(`${config.channels.report}`);
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();

		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : "https://i.imgur.com/yLv2YVnh.jpg";

		await webhook.send({ username: `${interaction.guild.name}`, avatarURL: `${avatarURL}`, embeds: [embed] }).catch(async (err) => {
			const error = new Discord.MessageEmbed()
				.setTitle('An error occured')
				.setColor('RED')
				.setDescription(`Sorry, I was unable to submit your report\n**${err.name}: ${err.message}**`);

			await interaction.followUp({ embeds: [error] });
			return;
		});

		await interaction.followUp({ content: 'Thank you for your report, it has been sent to my developers.' });

	}
};