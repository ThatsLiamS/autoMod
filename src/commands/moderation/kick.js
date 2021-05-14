const Discord = require('discord.js');
module.exports = {
    name: 'kick',
    description: "Temporarily removes a member from the server!\nNote: They can rejoin if they have a invite code",
    usage: '<@member> [reason]',
    permissions: ["Kick Members"], 
    myPermissions: ['Kick Members', 'Send Messages', 'Embed Links'],
    aliases: ["k"],
    async execute(message, args, prefix, client, firestore){
 
        const member = message.member;
 
        if(!args[0]) return message.reply(`Please include a member to ban`)
        
        const targetMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!targetMember) return message.reply(`Please include the user to kick`).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        
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
            .setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
            .setThumbnail(targetMember.user.displayAvatarURL())
            .addFields(
              { name: '**Who?**', value: `${targetMember}\n${targetMember.user.tag}`, inline: true },
              { name: '**Reason**', value: `${reason}`, inline: true },
            )
            .setTimestamp()
        
            if(errorMessage == true) return
            message.channel.send(channelkicked).catch(() => {})
        })
    }
}
