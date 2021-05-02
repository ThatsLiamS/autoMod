const Discord = require('discord.js');
const GhostPing = require('discord.js-ghost-ping');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client, firestore) {

        GhostPing.detector("messageUpdate", oldMessage, newMessage).catch(() => { })
        
        const profanities = ["bastard", "cunt", "fanny", "shit", "bitch", "pussy", "wanker", "fuck", "nigger", "nigga", "gook", "niger", "dick", " cum", "penis", "vagina"];
        const msg = newMessage.content.toLowerCase();
        for (x = 0; x < profanities.length; x++) {
            if (msg.includes(profanities[x])){
                let member = await newMessage.member;
                
                let document = await firestore.collection(`servers`).doc(`${newMessage.guild.id}`).get()
                if (!document.data()){
                    await firestore.collection(`servers`).doc(`${message.guild.id}`).set({
                      guild: message.guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
                    })
                }

                if(document.data().wordFilter.on == true){
                    newMessage.delete().catch(() => { })
                    newMessage.channel.send(`${member}'s message was deleted`).catch(() => { newMessage.author.send(`I saw your swear, Please refrain from this in the future.`)}).catch(() => { })

                    const embed = new Discord.MessageEmbed()
                    .setColor('#DC143C').setTitle(`Inappropriate Language`).setAuthor(`${newMessage.member.user.tag}`, `${newMessage.member.user.displayAvatarURL()}`).setThumbnail(member.user.displayAvatarURL()).addFields( { name: 'Author', value: `${member}`, inline: true }, { name: 'Message Content', value: `${newMessage}`, inline: true }, ).setTimestamp().setFooter(`Bot Created By @ThatsLiamS#6590`);

                    const channel = newMessage.guild.channels.cache.get(document.data().wordFilter.channel)
                    if(!channel) return newMessage.channel.send('I could not find The logging channel.')
                    
                    channel.send(embed).catch(() => { message.channel.send(`I failed to log this in ${channel}`)}).catch(() => { })
                    break; 
                };
            }
        }
    }
};
