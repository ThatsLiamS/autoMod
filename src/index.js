require('dotenv').config();
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', {
	totalShards: 'auto',
	token: process.env['BotToken'],
});

manager.on('shardCreate', shard => {
	console.log(`Launched shard ${shard.id + 1}/${this.totalShards}`);
});

manager.spawn(this.totalShards, 500, -1);
