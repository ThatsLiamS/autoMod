const Discord = require(`discord.js`);
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: "suggest",
	description: "Suggest a new feature for autoMod",
	usage: '<detailed suggestion>',
	arguments: 2,
	async execute(message, args, prefix, client) {

		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${args.splice(0).join(" ")}`)
			.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
			.setFooter(`ID: ${message.member.id}`)
			.setTimestamp();


		const channel = client.channels.cache.get(`${process.env.SupportSuggestID}`);
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();
		let avatarURL = message.guild.iconURL();
		if (!avatarURL) avatarURL = "https://i.imgur.com/yLv2YVnh.jpg";

		const result = await send.sendWebhook({ webhook: webhook, message: message }, { username: `${message.guild.name}`, avatarURL: `${avatarURL}`, embeds: [embed] });

		if(result == true) {
			message.reply(`Thanks for your suggestion. It has been sent to my developer`).catch(() => {
				message.author.send(`Thanks for your suggestion. It has been sent to my developer`).catch();
			}).catch();
			message.delete().catch();
		}
	}
};