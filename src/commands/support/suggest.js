const Discord = require(`discord.js`)
module.exports = {
    name: "suggest",
    description: "Suggest a new feature for autoMod",
    usage: '<detailed suggestion>',
    async execute(message, args, prefix, client){
        let errorMessage = false
	if(!args[0]) return message.reply("Please include your suggestion")

	const embed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setDescription(`**${client.user.tag}**\n${args.splice(0).join(" ")}`)
	.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
	.setFooter(`ID: ${member.id}`)
	.setTimestamp()

	const channel = client.channels.cache.get(`${process.env.SupportSuggestID}`);
	try {
            const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.first();
            let avatarURL = message.guild.iconURL();
            if (!avatarURL) avatarURL = "https://i.imgur.com/yLv2YVnh.jpg";
            await webhook.send({username: `${message.guild.name}`, avatarURL: `${avatarURL}`, embeds: [embed] })
		
	} catch{
            errorMessage = true
	    message.reply("I'm sorry - An internal error has occured with excuting that command. Please try again later").catch(() => { message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`)}).catch(() => { })
	}
        if(errorMessage == true) return
	    message.reply(`Thanks for your suggestion. It has been sent to my developer`).catch(() => { message.author.send(`Thanks for your suggestion. It has been sent to my developer`)}).catch(() => { })
	    message.delete().catch(() => { })
    }
}
