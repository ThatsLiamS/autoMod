const Discord = require(`discord.js`)
const moment = require('moment')
module.exports = {
    name: 'userinfo',
    description: "Displays lots of cool information about the user!",
    usage: '[member]',
    aliases: ["whois"],
    async execute(message, args, prefix, client, firestore){

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) user = message.member;
 
        let listOfRoles = "";
        user.roles.cache.forEach(role => {
            if (role.name != "@everyone") {
                if (listOfRoles == "")  listOfRoles += `<@&${role.id}>`
                else listOfRoles += `  <@&${role.id}>`
            }
        });
        if(listOfRoles.length < 1) listOfRoles = "none"

        let embed = new Discord.MessageEmbed()
        .setTitle(`${user.user.tag}'s Info`)
        .setThumbnail(user.user.displayAvatarURL())
        .setColor('GREEN')
        .addFields(
          { name: '**Username**', value: `${user.user.tag}`, inline: true },
          { name: '**User ID**', value: `${user.user.id}`, inline: true },
          { name: `**Account Ping**`, value: `${user}`, inline: true},
          { name: '**Created**', value: `${moment(user.user.createdAt).format("DD/MM/YYYY LTS") }`, inline: true },
          { name: '**Roles**', value: `${listOfRoles}`, inline: false}
        )
        .setTimestamp()
        .setFooter(`Requested By ${message.member.user.tag} || Bot made by @ThatsLiamS#6950`)
        message.channel.send(embed).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })

        client.developer.get('logs').execute(client, message, "UserInfo Command")
    }
}
