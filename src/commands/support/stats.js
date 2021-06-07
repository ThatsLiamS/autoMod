const Discord = require("discord.js");

module.exports = {
	name: "stats",
	description: "Shows information about the bot: `prefix`, `server count`, `user count`, `uptime` and so much more!",
	aliases: ["about", "botinfo"],
	arguments: 0,
	async execute(message, args, prefix, client) {

		const ping = Math.round(client.ws.ping);

		const result = await client.shard.fetchClientValues('guilds.cache.size');
		const servers = result.reduce((acc, guildCount) => acc + guildCount, 0);

		const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

		const embed = new Discord.MessageEmbed().setTitle("autoMod's Stats").setColor(`GREEN`)
			.setDescription(`**Prefix:** \`${prefix}\`⠀⠀ |‎‎‎|⠀**Developer:** ThatsLiamS#6950\n\n**Servers:** ${servers}⠀|‎‎‎‎‎‎‎‎‎‎‎‎|⠀**Users:** ${users}\n\n**Ping:** ${ping}ms ⠀|‎‎‎‎‎‎‎‎‎| **Uptime:** \`${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``);
		message.channel.send(embed).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`); }).catch();
	}
};
