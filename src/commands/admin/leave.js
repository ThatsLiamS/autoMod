const Discord = require('discord.js');
module.exports = {
	name: 'leave',
	description: "Forces autoMod to leave the server :sob:",
	ownerOnly: true,
	arguments: 0,
	async execute(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Good Bye!")
			.setDescription("Goodbye everyone, I am sorry I could no longer be of service to you.\n\nIf you ever want to invite me to your own server or back to this one, click [here](https://automod.web.app/invite)");
		await message.channel.send(embed).catch(() => {
			message.author.send(`Goodbye! You will be missed`).catch();
		}).catch();
		message.guild.leave();
	}
};
