const Discord = require('discord.js')
const { wordFilter } = require(`${__dirname}/../util/wordFilter`)
const { logs } = require(`${__dirname}/../util/developer/test`)

const prefix = '!'

module.exports = {
    name: 'message',
	async execute(message, client, firestore) {
        if (!message.author.bot && message.guild === null) return
        
        let error = false
        if(message.content.startsWith(prefix)){
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            if (command.length === 0) return;
            let cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
            if (!cmd) return;

            if(cmd.permissions){
                await cmd.permissions.forEach(permission => { 
                    if(!message.member.hasPermission(permission.trim().toUpperCase().replace(" ", "_")) && !message.member.hasPermission('ADMINISTRATOR')){
                        message.channel.send(`You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\``)
                        error = true
                        return
                    }
                });
            }


            let Ref = await firestore.collection(`servers`).doc(`${message.guild.id}`).get()
            if (!Ref.data()){
                await firestore.collection(`servers`).doc(`${message.guild.id}`).set({
                    guild: message.guild.id, wordFilter: { on: false, channel: `n/a`, level: `soft` }, ghostping: { on: false, everyone: false, logs: { on: false, channel: `n/a` } }, welcome: { on: false, channel: `n/a`, embed: { title: `n/a`, message: `n/a`, color: `n/a`, footer: `n/a` } }, logs: { on: false, channel: `n/a` }
                })
            }

            if(error == false){
                cmd.execute(message, args, prefix, client, firestore);
                logs(client, message, `${command} Command`)
            }

            wordFilter(message, firestore)
        }
    }
};