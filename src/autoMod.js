const express = require('express'); const app = express(); const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const admin = require("firebase-admin"); const serviceAccount = require("./firebase.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

client.commands = new Discord.Collection();
const categories = fs.readdirSync('./commands/');
for (const category of categories) {
    const commandFiles = fs.readdirSync(`./commands/${category}`).filter(File => File.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${category}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.developer = new Discord.Collection();
const files = fs.readdirSync('./developer/').filter(File => File.endsWith('.js'));
for (const file of files) {
    const dev = require(`./developer/${file}`);
    client.developer.set(dev.name, dev);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client, firestore));
}

client.login(process.env['AutomodToken'])
