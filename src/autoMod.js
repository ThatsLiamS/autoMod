const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const AutoPoster = require('topgg-autoposter');
const ap = AutoPoster(`${process.env['TopggToken']}`, client);
ap.on('posted', () => { });

const admin = require("firebase-admin"); const serviceAccount = require(`${__dirname}/util/developer/firebase.json`);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

client.commands = new Discord.Collection();
const categories = fs.readdirSync(`${__dirname}/text_commands/`);
for (const category of categories) {
	const commandFiles = fs.readdirSync(`${__dirname}/text_commands/${category}`).filter(File => File.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${__dirname}/text_commands/${category}/${file}`);
		client.commands.set(command.name, command);
	}
}

const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client, firestore));
}

client.login(process.env['AutomodToken']);