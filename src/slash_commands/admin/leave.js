const Discord = require('discord.js');

const config = require(`${__dirname}/../../../config`);

module.exports = {
	name: 'leave',
	description: "Forces autoMod to leave the server :winky_face:",
	ownerOnly: true,
	async execute(interaction) {

		await interaction.defer({ ephemeral: false });

		const embed = new Discord.MessageEmbed()
			.setTitle("Good Bye!")
			.setDescription(`Goodbye everyone, I am sorry I could no longer be of service to you.\n\nIf you ever want to invite me to your own server or back to this one, click [here](${config.invite})`)
			.setFoter('jk, lol');

		await interaction.followUp({ embeds: [embed] });
	}
};