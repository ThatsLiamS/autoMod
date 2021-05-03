const Discord = require('discord.js');
module.exports = {
    name: 'kick',
    description: "Temporarily removes a member from the server!\nNote: They can rejoin if they have a invite code",
    usage: '<@member> [reason]',
    permissions: ["Kick Members"], 
    aliases: ["k"],
    async execute(message, args, prefix, client, firestore){
 
        const member = message.member;

        if (!member.hasPermission("KICK_MEMBERS")) return message.reply("You do not have permission to use this command, if it is a mistake please contact the server owner").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        if(!message.guild.me.hasPermission("KICK_MEMBERS") && !message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("I do have not permission to kick members").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        
        if(!args[0]) return message.reply(`Please include a member to ban`)
        
        const targetMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!targetMember) return message.reply(`Please include the user to kick`).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        
        if(targetMember.id == message.guild.owner.id) return message.reply("I'm sorry but you can not kick the owner of the server!").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        if(targetMember.id == message.author.id) return message.reply("You can not kick yourself").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
 
        let reason = args.slice(1).join(" ");
        if (reason.length < 1) reason = "No reason specified"
        
        let errorMessage = false
        targetMember.kick({reason: `${reason}`}).catch(() => {
            message.channel.send(`Sorry, an error occured when trying to kick ${targetMember.user.tag}`).catch(() => { message.author.send(`I am unable to kick that member.`)}).catch(() => { })
            errorMessage = true
        }).then(() => {

            const channelkicked = new Discord.MessageEmbed()
            .setColor('#DC143C')
            .setTitle(`A Member Was Kicked`)
            .setThumbnail(targetMember.user.displayAvatarURL())
            .addFields(
              { name: '**Who?**', value: `${targetMember}\n${targetMember.user.tag}`, inline: true },
              { name: '**Reason**', value: `${reason}`, inline: true },
            )
            .setTimestamp()
            .setFooter(`Kick Was Requested By @${member.user.tag} | Bot Created By @ThatsLiamS#3813 and Team\n`)
        
            if(errorMessage == true) return
            message.channel.send(channelkicked).catch(() => {})
        })
    }
}
