const { ShardingManager } = require('discord.js');
const manager = new ShardingManager(`${__dirname}/autoMod.js`, { 
    totalShards: "auto", 
    token: process.env['AutomodToken']
});

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)
})

manager.spawn();
