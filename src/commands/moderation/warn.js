const Discord = require('discord.js');
module.exports = {
    name: 'warn',
    description: "Warns a member from breaking the rules!",
    usage: '<@member> [reason]',
    permissions: ["Kick Members"], 
    aliases: ["w"],
    async execute(message, args, prefix, client, firestore){

        let memberTarget = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        if(!memberTarget) return message.channel.send("Please mention/include the user you want to warn").catch(() => { message.author.send(`Please mention/include the user you want to warn`) }).catch(() => { })

        let reason = args.slice(1).join(" ")
        if(!reason) reason = "No reason specified"
        if(reason.length > 1024) return message.channel.send("The reason specified was too long. Please keep reasons under 1024 characters").catch(() => { message.author.send(`The reason specified was too long. Please keep reasons under 1024 characters`) }).catch(() => { })

        const userMessage = new Discord.MessageEmbed()
        .setTitle(`You have been warned!`)
        .setColor(`#DC143C`)
        .addFields(
          {name:`**Moderator**`, value:`${message.member}\n${message.author.tag}`},
          {name:`**Reason**`, value:`${reason}`}
        )
        .setFooter(`Bot made by @ThatsLiamS#6950`)

        memberTarget.user.send(userMessage).catch(() => { message.channel.send(`unable to send the message to ${memberTarget.user.tag}`) }).catch(() => { })

        const channelMessage = new Discord.MessageEmbed()
        .setTitle(`${memberTarget.user.tag} has been warned`)
        .setColor(`#DC143C`)
        channelMessage.addFields(
            {name:`**User**`, value:`${memberTarget}\n${memberTarget.user.tag}`},
            {name:`**Moderator**`, value:`${message.member}\n${message.author.tag}`},
            {name:`**Reason**`, value:`${reason}`}
        )
        .setFooter(`Bot made by @ThatsLiamS#6950`)
        message.channel.send(channelMessage).catch(() => { message.author.send(`I couldn't send messages in that channel`, channelMessage) }).catch(() => { })
    }
}
