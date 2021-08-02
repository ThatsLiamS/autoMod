const { logs } = require(`${__dirname}/../util/developer/test`);
module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, firestore) {

		if (interaction.isCommand()) {
			const commandName = interaction.commandName;
			const cmd = client.slash_commands.get(commandName);

			let allowed = true;

			if(cmd) {
				if(cmd.error && cmd.error == true) {
					allowed = false;
					await interaction.reply({ content: 'Sorry, this command is currently out of order. Please try again later!' });
				}

				if(cmd.permissions && allowed === true) {
					for(const permission of cmd.permissions) {
						if(allowed === true
							&& !interaction.member.permissions.has(permission.trim().toUpperCase().replace(" ", "_"))
							&& !interaction.member.permissions.has('ADMINISTRATOR')) {

							await interaction.reply({ content: `You do not have permission to use this command. To find out more information, do \`/help ${cmd.name}\`` });
							allowed = false;
						}
					}
				}

				if(cmd.ownerOnly && allowed === true) {
					if(interaction.member.Id !== interaction.guild.ownerID) {
						await interaction.reply({ content: `You do not have permission to use this command. To find out more information, do \`/help ${cmd.name}\`` });
						allowed = false;
					}
				}

				if(allowed == true) {
					cmd.execute(interaction, client, firestore);
					logs(client, interaction, `Slash Command: ${commandName}`);
				}
			}
		}
	}
};