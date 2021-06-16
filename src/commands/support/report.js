const Discord = require(`discord.js`);
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: "report",
	description: "Sends a bug report to the developers of autoMod",
	usage: '<detailed report>',
	arguments: 2,
	async execute(message, args, prefix, client) {

		let mes = args.splice(0).join(" ");
		let member = message.member;

		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setDescription(`**${client.user.tag}**\n${mes}`)
			.setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL()}`)
			.setFooter(`ID: ${member.id}`)
			.setTimestamp();

		const channel = client.channels.cache.get(`${process.env.SupportSuggestID}`);
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();
		let avatarURL = message.guild.iconURL();
		if (!avatarURL) avatarURL = "https://i.imgur.com/yLv2YVnh.jpg";

		const result = await send.sendWebhook({ webhook: webhook, message: message }, { username: `${message.guild.name}`, avatarURL: `${avatarURL}`, embeds: [embed] });

		if(result == true) {
			message.reply(`Thanks for your report. It has been sent to my developer`).catch(() => {
				message.author.send(`Thanks for your report. It has been sent to my developer`).catch();
			}).catch();
			message.delete().catch();
		}
	}
};