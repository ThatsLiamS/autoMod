const { logs } = require(`${__dirname}/../util/developer/test`);
module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

		if (interaction.isCommand()) {
			const command = interaction.commandName;
			const file = client.slash_commands.get(command);

			if(file) {
				file.execute(interaction, client);
				logs(client, interaction, `${command}: Slash Command`);
			}
		}
	}
};