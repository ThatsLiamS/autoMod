const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000, () => { return; });


const Discord = require('discord.js');
const client = new Discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_WEBHOOKS', 'GUILD_MESSAGE_REACTIONS'],
});

/*
const { AutoPoster } = require('topgg-autoposter');
const ap = AutoPoster(process.env['API_TOKEN'], client);
ap.on('posted', () => { });
*/

const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env['Database'])) });
const firestore = admin.firestore();


const fs = require('fs');
const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);

	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client, firestore));
}


client.login(process.env['BotToken']);
