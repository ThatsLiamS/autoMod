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
			send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Thank you for your sugestion, it has been sent to my support server.' });
			message.delete().catch();
		}
	}
};