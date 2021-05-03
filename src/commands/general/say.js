const Discord = require('discord.js');
module.exports = {
    name: 'say',
    description: 'Make autoMod repeat your sentence!',
    aliases: ["repeat"],
    usage: '<message>',
    async execute(message, args, prefix, client, firestore){ 
        if(!args[0]) return message.reply("Please include a message for me to say...")

        const profanities = ["@","bastard", "cunt", "fanny", "shit", "bitch", "pussy", "wanker", "fuck", "nigger","nigga", "gook", "niger", "dick", " cum ", "penis", "vagina"];
        const msg = message.content.toLowerCase();
        for (x = 0; x < profanities.length; x++) {
            if (msg.includes(profanities[x])){
                message.reply("I will not say that!")
                return
            }
        }
        
        let m3ssage = args.slice(0).join(" ");
        message.channel.send(m3ssage).catch(() => { message.author.send(`I am not able to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
    }
} 
