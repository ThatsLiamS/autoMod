const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,

	execute: async (interaction, client) => {

		/* Is interaction a command? */
		if (interaction.type === InteractionType.ApplicationCommand) {
			await interaction.deferReply({ ephemeral: false });

			const cmd = client.commands.get(interaction.commandName);
			if (!cmd) return false;

			/* Is the command working? */
			if (cmd['error'] == true) {
				interaction.followUp({ content: 'Sorry, this command is currently unavailable. Please try again later.', ephemeral: true });
				return;
			}

			if (cmd['permissions'] != []) {
				for (const permission of cmd['permissions']) {
					/* Loops through and check permissions against the user */
					if (!interaction.member.permissions.has(permission.replace(' ', '_').toUpperCase())) {
						interaction.followUp({ content: 'Sorry, you do not have permission to run this command.', ephemeral: true });
						return;
					}
				}
			}

			/* Execute the command file */
			await cmd.execute({ interaction, client });

		}

		/* Is interaction a button? */
		if (interaction.isButton()) {

			/* Locating button file */
			const category = interaction.customId.split('-')[0];
			const name = interaction.customId.split('-')[1];

			const file = require(`./../buttons/${category}/${name}`);

			/* Execute the button file */
			await file.execute({ interaction, client });
		}

	},
};
