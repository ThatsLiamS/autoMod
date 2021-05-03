const Discord = require("discord.js")
module.exports = {
    name: 'clear',
    description: "Bulk delete messages",
    usage: '<number 1-100>',
    permissions: ["Manage Messages"], 
    aliases: ["purge"],
    async execute(message, args, prefix, client, firestore){
        const member = message.member
        
        if(member.hasPermission(`MANAGE_MESSAGES`)){
            if(!message.guild.me.hasPermission("MANAGE_MESSAGES") && !message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("I do have not permission to delete messages!").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
            if(!args[0]) return message.reply(`Please include the number of messages you wish to delete`).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
            if (Number(args[0]) > 100) return message.reply(`I'm sorry, I have a limit of 100 messages per command.`).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })

            await message.delete().catch(() => { })
            message.channel.bulkDelete(args[0]).catch(() => { message.channel.send("I can not delete messages over 14 days old") })
          
        }
        else{
            message.reply(`I'm sorry, You do not have permission to use this command.`).catch(() => { message.author.send(`I'm sorry. You do not have permission to use that command`)}).catch(() => { })
        }
    }
}
