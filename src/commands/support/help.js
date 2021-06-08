const Discord = require('discord.js');
module.exports = {
	name: 'help',
	arguments: 0,
	async execute(message, args, prefix, client) {
		const member = await message.member;

		const realhelp = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`autoMod Commands`)
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(`To view the information about a certain Command do \n\`${prefix}help <command>\` For Example \`${prefix}help points\``)
			.addFields(
				{ name: 'General Commands', value: `\`${prefix}serverinfo\` \`${prefix}userinfo\` \`${prefix}8ball\` \`${prefix}coinflip\` \`${prefix}say\``, inline: true },
				{ name: 'Moderation Commands', value: `\`${prefix}ban\` \`${prefix}unban\`  \`${prefix}kick\` \`${prefix}clear\` \`${prefix}warn\` \`${prefix}slowmode\``, inline: true },
			)
			.addField('Admin Commands', `\`${prefix}leave\` \`${prefix}enable\` \`${prefix}disable\``, true)
			.addField(`Support Commands`, `\`${prefix}help\` \`${prefix}report\` \`${prefix}suggest\` \`${prefix}stats\``)
			.setTimestamp()
			.setFooter(`Requested By ${member.user.tag}`);

		if(args[0]) {
			const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${client.user.username} Commands`)
				.setThumbnail(client.user.displayAvatarURL());

			const command = args.shift().toLowerCase();
			const file = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

			if(!file || file.name == "help") {
				return message.channel.send(realhelp).catch(() => {
					message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
				}).catch();
			}

			if(file.description) { embed.setDescription(`${file.description}`); }

			if(file.name) {
				if(file.usage) { embed.addFields({ name: `__Usage:__`, value: `${prefix}${file.name} ${file.usage}`, inline: false }); }
				else { embed.addFields({ name: `__Usage:__`, value: `${prefix}${file.name}`, inline: true }); }
			}

			if(file.aliases) {
				let aliasesString = "";

				file.aliases.forEach(alias => { aliasesString += `\`${alias}\`\n`; });
				embed.addFields({ name: `__Aliases:__`, value: `${aliasesString}`, inline: true });
			}

			if(file.permissions && !file.ownerOnly) {
				let permissionString = "";

				file.permissions.forEach(permission => { permissionString += `\`${permission}\`\n`; });
				embed.addFields({ name: `__Permissions:__`, value: `${permissionString}`, inline: true });
			}
			if(file.ownerOnly) {
				embed.addFields({ name: `__Permissions:__`, value: `\`Server Owner\``, inline: true });
			}

			message.channel.send(embed).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`).catch();
			}).catch();
		}
		else {
			message.channel.send(realhelp).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`).catch();
			}).catch();
		}
	}
};