const Discord = require('discord.js');
const possibleAnswers = [`As I see it, yes.`,`Ask again later.`,`Better not tell you now.`,`Cannot predict now.`,`Concentrate and ask again.`,`Don’t count on it.`,`It is certain.`,`It is decidedly so.`,`Most likely.`,`My reply is no.`,`My sources say no.`,`Outlook not so good.`,`Outlook good.`, `Reply hazy, try again.`,`Signs point to yes.`,`Very doubtful.`,`Without a doubt.`,`Yes.`,`Yes – definitely.`,`You may rely on it.`];

module.exports = {
    name: '8ball',
    description: 'Ask a question, and get an answer from the all-knowing, magic 8ball!',
    aliases: ["8-ball"],
    usage: '<question>',
    async execute(message, args, prefix, client, firestore){
   
        if(!args[0]) return message.reply(`Please include your question to ask the \`magic 8ball\`.`)
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`Magic 8 Ball`)
        .addField(`**Your Question:**`, `${args.slice(0).join(" ")}`)
        .addField(`**My Answer**`, `${possibleAnswers[Math.floor((Math.random() * 19) + 0)]}`)
        .setColor(`RANDOM`)
        .setThumbnail(`https://i.imgur.com/SD5OXUV.jpg`)
        message.channel.send(embed).catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })

    }
}
