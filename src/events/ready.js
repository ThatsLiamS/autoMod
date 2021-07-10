const Discord = require("discord.js");
const send = require(`${__dirname}/../util/send`);

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {

		const results = await client.shard.fetchClientValues('guilds.cache.size');
		const serverCount = results.reduce((acc, guildCount) => acc + guildCount, 0);

		const users = await client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes().length}, ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} UTC`;

		client.user.setPresence({
			status: "online",
			activities: [{ type: `WATCHING`, name: `Over Your Server! do /help` }]
		});

		const channel = client.channels.cache.get('859562190758608956');

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('It\'s aliveee!')
			.addFields(
				{ name: '__Time:__', value: `${startTime}`, inline: false },
				{ name: '__Server Count:__', value: `${serverCount}`, inline: false },
				{ name: '__User Count:__', value: `${users}`, inline: false }
			)
			.setFooter("I'm back! Time to moderate");

		await send.sendChannel({ channel: channel, author: 'n/a' }, { embeds: [embed] });

		console.log(`Last restart: ${startTime}\n\nLogged in as ${client.user.tag}! looking over ${serverCount} servers`);
	}
};