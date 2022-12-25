const { InteractionType, Collection } = require('discord.js');
const cooldowns = new Collection();

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

			/* Work out the appropriate cooldown time */
			if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Collection());
			const timestamps = cooldowns.get(cmd.name);
			const cooldownAmount = (cmd?.cooldown?.time || 0) * 1000;

			if (timestamps.has(interaction.user.id)) {
				interaction.reply({ content: 'Please wait to use this command again.' });
				return false;
			}

			/* Execute the command file */
			try {
				cmd.execute({ interaction, client }).then((res) => {
					if (res == true) {
						/* Set and delete the cooldown */
						timestamps.set(interaction.user.id, new Date());
						setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
					}
				}).catch((err) => console.log(err));
			}
			catch (err) { console.log(err); }

		}

		/* Is interaction a button? */
		if (interaction.isButton()) {

			/* Locating button file */
			const category = interaction.customId.split('-')[0];
			const name = interaction.customId.split('-')[1];

			const file = require(`./../buttons/${category}/${name}`);
			if (!file) return false;

			/* Execute the button file */
			try {
				await file.execute({ interaction, client }).then(() => {
					return true;
				}).catch((err) => console.log(err));
			}
			catch (err) { console.log(err); }
		}

	},
};
