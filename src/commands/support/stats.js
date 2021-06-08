const Discord = require("discord.js");

module.exports = {
	name: "stats",
	description: "Shows information about the bot: `prefix`, `server count`, `user count`, `uptime` and so much more!",
	aliases: ["about", "botinfo", "servercount", "developer"],
	arguments: 0,
	async execute(message, args, prefix, client) {

		const ping = Math.round(client.ws.ping);
		const uptime = `${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``;

		const result = await client.shard.fetchClientValues('guilds.cache.size');
		const servers = result.reduce((acc, guildCount) => acc + guildCount, 0);

		const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

		const shard = `# ${message.guild.shardID + 1} out of ${client.shard.count}`;

		const embed = new Discord.MessageEmbed()
			.setTitle("My Stats")
			.setColor(`GREEN`)
			.setDescription(`Hey, I'm [**${client.user.tag}**](https://bit.ly/autoMod_invite)! My prefix is: \`${prefix}\`\nYou can also mention me as a prefix!`)
			.addFields(
				{ name: `**Developer:**`, value:`[ThatsLiamS#6950](https://github.com/ThatsLiamS)`, inline: false },
				{ name: `**Discord Stats:**`, value:`Servers: ${servers}\nUsers: ${users}\n\nShard: ${shard}`, inline: false },
				{ name: `**Bot's Stats:**`, value:`Ping: \`${ping}ms\`\nUptime: \`${uptime}`, inline: false },
			);

		message.channel.send(embed).catch(() => {
			message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`).catch();
		}).catch();
	}
};