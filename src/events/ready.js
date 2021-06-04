module.exports = {
	name: "ready",
	once: true,
	async execute(client) {

		const results = await client.shard.fetchClientValues('guilds.cache.size');
		const serverCount = results.reduce((acc, guildCount) => acc + guildCount, 0);


		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} UTC`;

		await client.user.setPresence({ status: "online", activity:{ name: `Over Your Server`, type: `WATCHING` } });

		console.log(`Last restart: ${startTime}\n\nLogged in as ${client.user.tag}! looking over ${serverCount} servers`);
	}
};