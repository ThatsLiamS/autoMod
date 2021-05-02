const Discord = require('discord.js');
module.exports = {
    name: 'leave',
    description: "Forces autoMod to leave the server :sob:",
    permissions: ["Server Owner"],
    async execute(message){
        if (message.guild.ownerID !== message.author.id) return message.reply(`Sorry, you must be the server owner to use this commmand!`).catch(() => { message.author.send(`I am unable to send messages in that channel, please switch to a different channel.`)}).catch(() => { })

        const embed = new Discord.MessageEmbed()
        .setTitle("Good Bye!")
        .setDescription("Goodbye @everyone, I am sorry I could no longer be of service to you.\n\nIf you ever want to invite me to your own server or back to this one, click [here](https://automod.web.app/invite)")
        await message.channel.send(embed).catch(() => { message.author.send(`Goodbye! You will be missed`)}).catch(() => { })
        message.guild.leave()
    }
}
