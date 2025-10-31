const fs = require('fs');

// eslint-disable-next-line no-unused-vars
const { Client, Collection } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Client} client Discord Bot's Client
	 * @returns {boolean}
	**/
	execute: async (client) => {

		/* Logs the Shard's Id */
		console.log(`Shard ${client.shard.ids[0] + 1}/${client.shard.count} ready`);

		/* Set client status: type 3 == Watching */
		client.user.setPresence({
			status: 'online',
			activities: [{ type: 3, name: 'over your server! do /help for more.' }],
		});

		/* Registering slash commands */
		client.commands = new Collection();
		const data = [];

		const categories = fs.readdirSync(`${__dirname}/../commands/`);
		for (const category of categories) {
			const commandFiles = fs.readdirSync(`${__dirname}/../commands/${category}`)
				.filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {

				// eslint-disable-next-line security/detect-non-literal-require
				const command = require(`${__dirname}/../commands/${category}/${file}`);
				client.commands.set(command.name, command);
				data.push(command.data.toJSON());

			}
		}

		/* Set ApplicationCommand data */
		await client.application.commands.set(data);

	},
};
