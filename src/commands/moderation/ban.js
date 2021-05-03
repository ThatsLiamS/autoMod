const Discord = require('discord.js');
module.exports = {
    name: 'ban',
    description: "Permanently removes a member from the server!",
    usage: '<@member> [reason]',
    permissions: ["Ban Members"], 
    aliases: ["b", "permban"],
    async execute(message, args, prefix, client, firestore){

        const member = message.member;

        if (!member.hasPermission("BAN_MEMBERS")) return message.reply("You do not have permission to use this command, if it is a mistake please contact the server owner").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        if(!message.guild.me.hasPermission("BAN_MEMBERS") && !message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("I do have not permission to ban members").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        
        if(!args[0]) return message.reply(`Please include a member to ban`)
        
        const targetMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!targetMember) return message.reply(`Please include a Member to ban`).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })

        if(targetMember.id == message.guild.owner.id) return message.reply("I'm sorry but you can not ban the owner of the server!").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
        if(targetMember.id == message.author.id) return message.reply("You can not ban yourself").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
   
        if(!targetMember.banable) return message.reply(`I am unable to ban ${targetMember.user.tag}`)

        let reason = args.slice(1).join(" ");
        if (reason.length < 1) reason = "No reason specified"

        let errorMessage = false
        
        user.ban({ days: 0, reason: `${reason}` }).catch(() => {
            message.channel.send(`Sorry, an error occured when trying to ban ${targetMember.user.tag}`).catch(() => { message.author.send(`I am unable to ban that member.`)}).catch(() => { })
            errorMessage = true
        }).then(() => {
            const channelBanned = new Discord.MessageEmbed()
            .setColor('#DC143C')
            .setTitle(`A Member Was Banned`)
            .setThumbnail(user.user.displayAvatarURL())
            .addFields(
                { name: '**Who?**', value: `${targetMember}\${targetMember.user.tag}`, inline: true },
                { name: '**Reason**', value: `${reason}`, inline: true },
            )
            .setTimestamp()
            .setFooter(`Ban was requested by @${member.user.tag} | Bot Created By @ThatsLiamS#3813\n`)
            
            if(errorMessage == true) return
            message.channel.send(channelBanned).catch(() => {})

        })
    }
}
