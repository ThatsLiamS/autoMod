const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

/*
const { AutoPoster } = require('topgg-autoposter');
const ap = AutoPoster(process.env['API_TOKEN'], client);
ap.on('posted', () => { });
*/

const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env['Database'])) });
const firestore = admin.firestore();


const { readdirSync } = require('fs');
const eventFiles = readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(__dirname + '/events/' + file);

	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client, firestore));
}


client.login(process.env['BotToken']);
