const Discord = require('discord.js');
module.exports = {
    name: 'slowmode',
    description: "Change the slowmode time in the channel!",
    usage: '<number/off>',
    permissions: ["Manage Channel"], 
    aliases: ["sm"],
    async execute(message, args, prefix, client, firestore){
        
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply("You do not have permission to use this command, if it is a mistake please contact the server owner").catch(() => { })
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS") && !message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("I do have not permission to manage the channel").catch(() => { })
        if(!args[0]) return message.reply("Please include how long you want slowmode for").catch(() => { })

        if(args[0] == "off"){
            try{
                message.channel.setRateLimitPerUser(0)
                message.channel.send(`Sucessfully turned the slowmode in ${message.channel} off!`).catch(() => { })
            }catch{
                message.reply("**I am unable to turn the slowmode off.**").catch(() => { })
            }
            return client.developer.get('logs').execute(client, message, "Slowmode Command")
        }

        if (isNaN (args[0])) return message.reply("Please provide a number to the slowmode to.").catch(() => {})
        if(Number(args[0]) > 21600) return message.reply("Sorry but slowmode can't be above 6 hours (21,600 seconds)").catch(() => {})
        
        try{
            message.channel.setRateLimitPerUser(args[0])
            message.channel.send(`Sucessfully set the slowmode in ${message.channel} to ${args[0]}!`).catch(() => {})
            client.developer.get('logs').execute(client, message, "Slowmode Command")
        }catch{
            message.channel.send(`**I am unable to set the slowmode to ${number}, sorry ${message.member}!`).catch(() => {})
        }
    }
}
