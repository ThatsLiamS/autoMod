const Discord = require("discord.js");
const { developers, bot } = require(`${__dirname}/../../util/values`);
const send = require(`${__dirname}/../../util/send`);

const getMemberCount = () => {
	return this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
};

function fitString(str, length) {
	length -= str.length;
	return str + " ".repeat(length);
}

function makeGrid(results) {
	const length = [8, 7, 7];

	const border = '+----+----------+----------+---------+';
	const title = '| ID |   PING​   | SERVERS  |  US​ERS  |';
	let rows = [];

	for(let y = 0; y < results[0].length; y++) {
		let values = [y + 1];

		for(let x = 0; x < 3; x++) {
			if(x == '0') {
				let num = results[x][y];
				num = num.toString();
				if(num.length == 2) { num = 0 + num; }

				values.push(`${num} ms  `);
			}
			else { values.push(fitString(results[x][y].toString(), length[x])); }
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	let grid = `${border}\n${title}\n${border}\n`;
	for(const row of rows) { grid += `${row}\n`; }
	grid += `${border}`;

	return grid;
}

module.exports = {
	name: "about",
	description: "Shows cool information about the bot!",
	aliases: ["stats", "botinfo", "prefix", "developer"],
	arguments: 0,
	async execute(message, args, prefix, client) {

		const uptime = `${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`;

		const promises = [
			client.shard.fetchClientValues('ws.ping'),
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(getMemberCount),
		];
		const results = await Promise.all(promises);

		const servers = results[1].reduce((acc, guildCount) => acc + guildCount, 0);
		const users = results[2].reduce((acc, memberCount) => acc + memberCount, 0);

		const shard = `#${Number(message.guild.shardId) + 1} out of ${client.shard.count}`;

		const embed = new Discord.MessageEmbed()
			.setTitle("My Information")
			.setColor(`GREEN`)
			.setDescription(`Hey, I'm **[${bot.tag}](${bot.invite})**! My prefix is: \`${prefix}\`\nYou can also mention me as a prefix!\n\n\`\`\`\n${makeGrid(results)}\`\`\``)
			.addFields(

				{ name: `**Total Servers:**`, value:`${servers}`, inline: true },
				{ name: `**Total Users:**`, value: `${users}`, inline: true },
				{ name: `**Total Commands:**`, value: `18`, inline: true },

				{ name: `**Developer:**`, value:`**[${developers.ThatsLiamS.tag}](${developers.ThatsLiamS.profile})**`, inline: true },
				{ name: `**Uptime:**`, value:`\`${uptime}\``, inline: true },
				{ name: `**Shard ID:**`, value:`\`${shard}\``, inline: true },
			);

		await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};