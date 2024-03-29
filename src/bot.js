/* Create the Discord Client */
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

/*
const { AutoPoster } = require('topgg-autoposter');
const ap = AutoPoster(process.env['API_TOKEN'], client);
ap.on('posted', () => false);
*/

/* Loop through the event files */
const { readdirSync } = require('fs');
const eventFiles = readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(__dirname + '/events/' + file);

	/* Set up the event listener */
	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client));
}

/* Logs in */
client.login(process.env['BotToken']);
