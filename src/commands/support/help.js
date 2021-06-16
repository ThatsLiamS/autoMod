const Discord = require('discord.js');
const send = require(`${__dirname}/../../util/send`);
const { bot } = require(`${__dirname}/../../util/values`);

module.exports = {
	name: 'help',
	arguments: 0,
	async execute(message, args, prefix, client) {
		const member = await message.member;

		const realhelp = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${client.user.username} Commands`)
			.setURL(bot.server)
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(`To view the information about a certain command do \n\`${prefix} help <command>\`. For example \`${prefix} help points\`.`)
			.addFields(
				{ name: '__General__', value: `\`serverinfo\` \`userinfo\` \`8ball\` \`coinflip\` \`say\``, inline: true },
				{ name: '__Moderation__', value: `\`ban\` \`unban\`  \`kick\` \`clear\` \`warn\` \`slowmode\``, inline: true },
				{ name: '__Admin__', value: `\`enable\` \`disable\` \`leave\``, inline: true },
				{ name: '__Support__', value: '`help` `report` `suggest` `about`', inline: false },
			)
			.setTimestamp()
			.setFooter(`Requested By ${member.user.tag}`);

		if(args[0]) {
			const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setThumbnail(client.user.displayAvatarURL())
				.setURL(bot.server);

			const command = args.shift().toLowerCase();
			const file = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

			if(!file || file.name == "help" || file.developerOnly == true) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { embed: realhelp });
				return;
			}

			if(file.name) {
				embed.setTitle(`${file.name} Command`);
			}

			if(file.description) {
				embed.setDescription(`${file.description}`);
			}

			if(file.name) {
				if(file.usage) {
					embed.addFields({ name: `__Usage:__`, value: `${prefix}${file.name} ${file.usage}`, inline: true });
				}
				else {
					embed.addFields({ name: `__Usage:__`, value: `${prefix}${file.name}`, inline: true });
				}
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

			await send.sendChannel({ channel: message.channel, author: message.author }, { embed: embed });
		}
		else {
			await send.sendChannel({ channel: message.channel, author: message.author }, { embed: realhelp });
		}
	}
};