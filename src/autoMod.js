const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

const Discord = require('discord.js');
const client = new Discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_WEBHOOKS'],
	repliedUser: false
});
const fs = require('fs');

const { AutoPoster } = require('topgg-autoposter');
const ap = AutoPoster(`${process.env['TopggToken']}`, client);
ap.on('posted', () => { });

const admin = require("firebase-admin"); const serviceAccount = require(`${__dirname}/util/developer/firebase.json`);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

client.text_commands = new Discord.Collection();
const t_categories = fs.readdirSync(`${__dirname}/text_commands/`);
for (const category of t_categories) {
	const commandFiles = fs.readdirSync(`${__dirname}/text_commands/${category}`).filter(File => File.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${__dirname}/text_commands/${category}/${file}`);
		client.text_commands.set(command.name, command);
	}
}

client.slash_commands = new Discord.Collection();
const s_categories = fs.readdirSync(`${__dirname}/slash_commands/`);
for (const category of s_categories) {
	const commandFiles = fs.readdirSync(`${__dirname}/slash_commands/${category}`).filter(File => File.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${__dirname}/slash_commands/${category}/${file}`);
		client.slash_commands.set(command.name, command);
	}
}

const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client, firestore));
}

async function sendError(error) {

	const channel = client.channels.cache.get('868455901659541565');
	const embed = new Discord.MessageEmbed()
		.setDescription(`${error}`);

	await channel.send({ embeds: [embed] });
}

process.on('uncaughtException', async (err) => {
	await sendError(err);
});
process.on('warning', async (err) => {
	await sendError(err);
});
process.on('uncaughtExceptionMonitor', async (err) => {
	await sendError(err);
});

client.login(process.env['AutomodToken']);