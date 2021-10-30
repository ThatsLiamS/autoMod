module.exports = {
	name: 'interactionCreate',
	once: false,

	execute: async (interaction, client, firebase) => {

		/* Is interaction a command? */
		if (interaction.isCommand()) {

			const cmd = client.commands.get(interaction.commandName);
			if (!cmd) return;

			/* Is the command working? */
			if (cmd['error'] == true) {
				interaction.reply({ content: 'Sorry, this command is currently unavailable. Please try again later.', ephemeral: true });
				return;
			}

			if (cmd['permissions'] != []) {
				for (const permission of cmd['permissions']) {
					/* Loops through and check permissions agasint the user */
					if (!interaction.member.permissions.has(permission)) {
						interaction.reply({ content: 'Sorry, you do not have permission to run this command.', ephemeral: true });
						return;
					}
				}
			}
			/* Is the command limited to the owner */
			if (cmd['ownerOnly'] == true) {
				if (!interaction.member.id == interaction.guild.ownerId) {
					interaction.reply({ content: 'Sorry, only the server owner can run this command.', ephemeral: true });
					return;
				}
			}

			/* Execute the command file */
			await cmd.execute({ interaction, client, firebase });

		}

	},
};
