const Discord = require("discord.js");
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        await client.user.setPresence({ status: "online", 
            activity:{ 
                name: `Over Your Server`, 
                type: `WATCHING` 
            } 
        })
        
        await console.log(`Logged in as ${client.user.tag}!\n looking over ${client.guilds.cache.size} servers`)
    }
}
