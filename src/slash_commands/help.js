const Discord = require('discord.js');

const { bot } = require(`${__dirname}/../util/values`);

const prefix = '!';

module.exports = {
	name: 'help',
	description: 'View all of my commands and extra details for individual commands!',
	options: [
		{ name: 'command', description: 'Enter a command', type: 'STRING', required: false },
	],
	async execute(interaction, client) {

		const option = interaction.options.get("command");

		const realhelp = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${client.user.username} Commands`)
			.setURL(bot.server)
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(`To view the information about a certain command do \n\`${prefix}help <command>\`. For example \`${prefix}help points\`.`)
			.addFields(
				{ name: '__General__', value: `\`serverinfo\` \`userinfo\` \`8ball\` \`coinflip\` \`say\``, inline: true },
				{ name: '__Moderation__', value: `\`ban\` \`unban\`  \`kick\` \`clear\` \`warn\` \`slowmode\``, inline: true },
				{ name: '__Admin__', value: `\`enable\` \`disable\` \`leave\``, inline: true },
				{ name: '__Support__', value: '`help` `report` `suggest` `about`', inline: false },
			)
			.setTimestamp();

		if(option) {
			const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setThumbnail(client.user.displayAvatarURL())
				.setURL(bot.server);

			const command = option.value.toLowerCase();
			const file = client.text_commands.get(command) || client.text_commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

			if(!file || file.name == "help") {
				await interaction.reply({ embeds: [realhelp] });
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

			await interaction.reply({ embeds: [embed] });

		}
		else {
			await interaction.reply({ embeds: [realhelp] });
		}
	}
};