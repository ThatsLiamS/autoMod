const Discord = require("discord.js");
const { developers, bot } = require(`${__dirname}/../../util/values`);
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: "about",
	description: "Shows cool information about the bot!",
	aliases: ["stats", "botinfo", "prefix", "developer"],
	arguments: 0,
	async execute(message, args, prefix, client) {

		const ping = Math.round(client.ws.ping);
		const uptime = `${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``;

		const result = await client.shard.fetchClientValues('guilds.cache.size');
		const servers = result.reduce((acc, guildCount) => acc + guildCount, 0);

		const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

		const shard = `# ${message.guild.shardID + 1} out of ${client.shard.count}`;

		const embed = new Discord.MessageEmbed()
			.setTitle("My Information")
			.setColor(`GREEN`)
			.setDescription(`Hey, I'm **[${bot.tag}](${bot.invite})**! My prefix is: \`${prefix}\`\nYou can also mention me as a prefix!`)
			.addFields(
				{ name: `**Developer:**`, value:`[${developers.ThatsLiamS.tag}](${developers.ThatsLiamS.profile})`, inline: false },
				{ name: `**Discord Stats:**`, value:`Servers: ${servers}\nUsers: ${users}`, inline: false },
				{ name: `**Bot's Stats:**`, value:`Ping: \`${ping}ms\`\nUptime: \`${uptime}\n\nShard: ${shard}`, inline: false },
			);

		await send.sendChannel({ channel: message.channel, author: message.author }, { embed: embed });
	}
};