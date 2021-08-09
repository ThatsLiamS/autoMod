module.exports = {
	name: "ready",
	once: true,
	async execute(client) {

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
		];
		const results = await Promise.all(promises);

		const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);

		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} UTC`;

		client.user.setPresence({
			status: "online",
			activities: [{ type: `WATCHING`, name: `Over Your Server! do /help` }]
		});

		console.log(`Last restart: ${startTime}\n\nLogged in as ${client.user.tag}! looking over ${servers} servers`);
	}
};