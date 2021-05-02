const Discord = require('discord.js');

const fs = require('fs')
disable = new Discord.Collection();
const files = fs.readdirSync(`${__dirname}/disable/`).filter(File => File.endsWith('.js'));
for (const file of files) {
    const fileinfo = require(`${__dirname}/disable/${file}`);
    disable.set(fileinfo.name, fileinfo);
}

module.exports = {
    name: 'disable',
    description: "Provides the ability to toggle certain features off, to help suit your requirements!",
    usage: '<feature>',
    permissions: ["Admin"],
    async execute(message, args, prefix, client, firestore){
        client.developer.get('logs').execute(client, message, "Disable Command")

        let member = message.member
        if(member.hasPermission('ADMINISTRATOR')){
            
            if(!args[0]) return message.reply(`Please include the feature you wish to disable`)

            if(args[0] == "word-filter") disable.get('wordFilter').execute(message, args, prefix, client, firestore)
            else{
                return message.reply('That is not a valid feature! The features are: `word-filter`')
            }       
        }
        else{
            message.reply(`:no: You do not have permission to use this command.`)
        }
    }
}
