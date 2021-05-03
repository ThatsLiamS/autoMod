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
    description: "Provides the ability to toggle certain features off, to help suit your server!\n\nThe features are: `word-filter` ~~and `ghost-ping`",
    usage: '<feature>',
    permissions: ["administrator"],
    async execute(message, args, prefix, client, firestore){

        const member = message.member
        if(member.hasPermission('ADMINISTRATOR')){
            
            if(!args[0]) return message.reply(`Please include the features you want to disable! To view the features do \`${prefix}help disable\``)

            if(args[0] == "word-filter") disable.get('wordFilter').execute(message, args, prefix, client, firestore)
            if(args[0] == "ghost-ping") disable.get('ghostPing').execute(message, args, prefix, client, firestore)
            
            else return message.reply(`That is not a valid feature! To view the features do \`${prefix}help disable\``)
   
        }
        else{
            message.reply(`:no: You do not have permission to use this command.`)
        }
    }
}
