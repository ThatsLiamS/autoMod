const Discord = require('discord.js');

module.exports = {
	name: 'suggest',
	description: 'Suggest a new command or feature!.',
	options: [
		{ name: 'description', description: 'Provide an in-depth explantation of your suggestion', type: 'STRING', required: true },
	],
	async execute(interaction, client) {

		await interaction.defer({ ephemeral: true });

		const description = interaction.options.getString("description");

		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${description}`)
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setFooter(`ID: ${interaction.member.id}`)
			.setTimestamp();

		const channel = client.channels.cache.get(`${process.env.SupportSuggestID}`);
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();

		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : "https://i.imgur.com/yLv2YVnh.jpg";

		await webhook.send({ username: `${interaction.guild.name}`, avatarURL: `${avatarURL}`, embeds: [embed] }).catch(async (err) => {
			const error = new Discord.MessageEmbed()
				.setTitle('An error occured')
				.setColor('RED')
				.setDescription(`Sorry, I was unable to submit your suggestion\n**${err.message}**`);

			await interaction.send({ embeds: [error] });
			return;
		});


		await interaction.followUp({ content: 'Thank you for your suggestion, it has been sent to my developers.' });

	}
};