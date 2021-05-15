const Discord = require('discord.js');
module.exports = {
    name: 'slowmode',
    description: "Change the slowmode time in the channel!",
    usage: '<number/off>',
    permissions: ["Manage Channels"], 
    aliases: ["sm"],
    async execute(message, args, prefix, client, firestore){
        
        if(!args[0]) return message.reply("Please include how long you want slowmode for").catch(() => { })

        if(args[0] == "off"){
            try{
                message.channel.setRateLimitPerUser(0)
                message.channel.send(`Sucessfully turned the slowmode in ${message.channel} off!`).catch(() => { })
            }catch{
                message.reply("**I am unable to turn the slowmode off.**").catch(() => { })
            }
        }
        else{

            if (isNaN (args[0])) return message.reply("Please provide a number to the slowmode to.").catch(() => {})
            if(Number(args[0]) > 21600) return message.reply("Sorry but slowmode can't be above 6 hours (21,600 seconds)").catch(() => {})
        
            try{
                message.channel.setRateLimitPerUser(args[0])
                message.channel.send(`Sucessfully set the slowmode in ${message.channel} to ${args[0]}!`).catch(() => {})
            }catch{
                message.channel.send(`**I am unable to set the slowmode to ${number}, sorry ${message.member}!`).catch(() => {})
            }
        }
    }
}
