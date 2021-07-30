const fs = require('fs');
const Discord = require('discord.js');

const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'deploy_slash',
	description: "Deploy and update slash commands!",
	developerOnly: true,
	aliases: ['update_slash', "deployslash", "updateslash"],
	async execute(message, args, prefix, client) {
		let data = [];

		const commandFiles = fs.readdirSync(`${__dirname}/../../slash_commands/`).filter(File => File.endsWith('.js'));
		for (const file of commandFiles) {
			const cmd = require(`${__dirname}/../../slash_commands/${file}`);

			let object = {
				name: cmd.name, description: cmd.description,
			};
			if(cmd.options) { object.options = cmd.option; }

			data.push(object);
		}
		await client.application.commands.set(data);

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription('Slash Commands have been updated!');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};