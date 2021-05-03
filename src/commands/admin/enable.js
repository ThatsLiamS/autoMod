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
    description: "Provides the ability to toggle certain features on, to help suit your server!\n\nThe features are: `word-filter` and `ghost-ping`",
    aliases: [],
    usage: '<feature> <channel>',
    permissions: ["Admin"],
    async execute(message, args, prefix, client, firestore){

        const member = await message.member
        if(member.hasPermission('ADMINISTRATOR')){

            if(!args[0]) return message.reply(`Please include the features you want to disable! To view the features do \`${prefix}help enable\``)

            if(args[0] == "word-filter") enable.get('wordFilter').execute(message, args, prefix, client, firestore)
            if(args[0] == "ghost-ping") enable.get('ghostPing').execute(message, args, prefix, client, firestore)
            
            else return message.reply('That is not a valid feature! To view the features do \`${prefix}help enable\`')      
        }
        else{
            message.reply(`:no: You do not have permission to use this command.`)
        }
    }
}
