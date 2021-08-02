const fs = require('fs');
const Discord = require('discord.js');

const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'deploy_slash',
	description: "Deploy and update slash commands!",
	developerOnly: true,
	async execute(message, args, prefix, client) {
		let data = [];

		const path = `${__dirname}/../../slash_commands/`;

		const categories = fs.readdirSync(`${path}`);
		for (const category of categories) {
			const commandFiles = fs.readdirSync(`${path}${category}`).filter(File => File.endsWith('.js'));
			for (const file of commandFiles) {
				const cmd = require(`${path}${category}/${file}`);

				let object = {};

				if(cmd.name) { object.name = cmd.name; }
				if(cmd.description) { object.description = cmd.description; }
				if(cmd.options) { object.options = cmd.options; }

				data.push(object);
			}
		}

		await client.application.commands.set(data);

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription('Slash Commands have been updated!');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};