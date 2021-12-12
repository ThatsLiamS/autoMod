const time = new Date();
console.log(`Last restart: ${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()} UTC`);


require('dotenv').config();
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', {
	totalShards: 'auto',
	token: process.env['BotToken'],
	respawn: true,
});

manager.on('shardCreate', (shard) => {
	console.log(`Launched shard ${shard.id + 1}/${manager.totalShards}`);
});

manager.spawn({ amount: this.totalShards, delay: 500, timeout: -1 });
