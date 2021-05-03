const Discord = require('discord.js');
module.exports = {
    name: 'links',
    description: "Send links to all the important autoMod websites.",
    aliases: ["website", "legal", "invite", "vote"],
    async execute(message, args, prefix, client){

        const embed1 = new Discord.MessageEmbed()
        .setTitle(`Links`)
        .addFields(
            { name: `__Support:__`, value:`[Support Server](https://discord.gg/2je9aJynqt)`, inline:true },
            { name: `__Invite:__`, value:`[Invite Me](https://automod-bot.web.app/invite)`, inline:true },
            { name: `__Vote:__`, value:`[Top.gg](https://top.gg/bot/782985846474932315)`, inline:true },
        )
        message.channel.send(embed1).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })

    }
}
