const Discord = require('discord.js');

const fs = require('fs')
enable = new Discord.Collection();
const files = fs.readdirSync(`${__dirname}/enable/`).filter(File => File.endsWith('.js'));
for (const file of files) {
    const fileinfo = require(`${__dirname}/enable/${file}`);
    enable.set(fileinfo.name, fileinfo);
}

module.exports = {
    name: 'enable',
    description: "Provides the ability to toggle certain features on, to help suit your requirements!",
    aliases: [],
    usage: '<feature> <channel>',
    permissions: ["Admin"],
    async execute(message, args, prefix, client, firestore){
        client.developer.get('logs').execute(client, message, "Enable Command")

        let member = message.member
        if(member.hasPermission('ADMINISTRATOR')){

            if(!args[0]) return message.reply(`Please include the feature you wish to enable`)

            if(args[0] == "word-filter") enable.get('wordFilter').execute(message, args, prefix, client, firestore)
            
            else{
                return message.reply('That is not a valid feature! The features are: `word-filter`')
            }       
        }
        else{
            message.reply(`:no: You do not have permission to use this command.`)
        }
    }
}
