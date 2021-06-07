const Discord = require(`discord.js`);
module.exports = {
	name: "report",
	description: "Sends a bug report to the developers of autoMod",
	usage: '<detailed report>',
	arguments: 2,
	async execute(message, args, prefix, client) {
		let errorMessage = false;
		let mes = args.splice(0).join(" ");
		let member = message.member;

		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setDescription(`**${client.user.tag}**\n${mes}`)
			.setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL()}`)
			.setFooter(`ID: ${member.id}`)
			.setTimestamp();

		const channel = client.channels.cache.get(`${process.env.SupportReportID}`);
		try {
			const webhooks = await channel.fetchWebhooks();
			const webhook = webhooks.first();
			let avatarURL = message.guild.iconURL();
			if (!avatarURL) avatarURL = "https://i.imgur.com/yLv2YVnh.jpg";
			await webhook.send({ username: `${message.guild.name}`, avatarURL: `${avatarURL}`, embeds: [embed], });

		}
		catch {
			errorMessage = true;
			message.reply("I'm sorry - An internal error has occured with excuting that command. Please try again later").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`); }).catch();
		}
		if(errorMessage == false) {
			message.reply(`Thanks for your report. It has been sent to my developer`).catch(() => { message.author.send(`Thanks for your report. It has been sent to my developer`); }).catch();
			message.delete().catch();
		}
	}
};