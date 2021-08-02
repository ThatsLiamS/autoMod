const Discord = require("discord.js");
const send = require(`${__dirname}/../util/send`);

const config = require(`${__dirname}/../../config`);

const getMemberCount = () => {
	return this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
};

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(getMemberCount),
		];
		const results = await Promise.all(promises);

		const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
		const users = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} UTC`;

		client.user.setPresence({
			status: "online",
			activities: [{ type: `WATCHING`, name: `Over Your Server! do /help` }]
		});

		const channel = client.channels.cache.get(`${config.channels.uptime}`);

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('It\'s aliveee!')
			.addFields(
				{ name: '__Time:__', value: `${startTime}`, inline: false },
				{ name: '__Server Count:__', value: `${servers}`, inline: false },
				{ name: '__User Count:__', value: `${users}`, inline: false }
			)
			.setFooter("I'm back! Time to moderate");

		await send.sendChannel({ channel: channel, author: 'n/a' }, { embeds: [embed] });

		console.log(`Last restart: ${startTime}\n\nLogged in as ${client.user.tag}! looking over ${servers} servers`);
	}
};