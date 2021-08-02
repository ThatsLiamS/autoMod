const Discord = require('discord.js');

const { bot } = require(`${__dirname}/../../util/values`);

module.exports = {
	name: 'leave',
	description: "Forces autoMod to leave the server :winky_face:",
	ownerOnly: true,
	arguments: 0,
	async execute(interaction) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Good Bye!")
			.setDescription(`Goodbye everyone, I am sorry I could no longer be of service to you.\n\nIf you ever want to invite me to your own server or back to this one, click [here](${bot.invite})`);

		await interaction.followUp({ embeds: [embed] });
	}
};