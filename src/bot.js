const { readdirSync } = require('fs');

const { Client, GatewayIntentBits, Partials } = require('discord.js');


/* Create the Discord Client */
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.Reaction,
	],
});


/* Loop through the event files */
const eventFiles = readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {

	// eslint-disable-next-line security/detect-non-literal-require
	const event = require(__dirname + '/events/' + file);

	/* Set up the event listener */
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

/* Logs in */
client.login(process.env['BotToken']);
