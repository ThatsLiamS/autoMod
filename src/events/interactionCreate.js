module.exports = {
	name: 'interactionCreate',
	once: false,

	execute: async (interaction, client, firebase) => {

		if(interaction.isCommand()) {
			
			const cmd = client.commands.get(interaction.commandName);
			if(!cmd) return;


			if(cmd['error'] == true) {
				interaction.reply({ content: 'Sorry, this command is currently unavailable. Please try again later.', ephemeral: true });
				return;
			}

			if(cmd['permissions'] != []) {
				for(const permission of cmd['permissions']) {

					if(!interaction.member.permissions.has(permission)) {
						interaction.reply({ content: 'Sorry, you do not have permission to run this command.', ephemeral: true });
						return;
					}
				}
			}

			if(cmd['ownerOnly'] == true) {
				if(!interaction.member.id == interaction.guild.ownerId) {
					interaction.reply({ content: 'Sorry, only the server owner can run this command.', ephemeral: true });
					return;
				}
			}


			await cmd.execute({ interaction, client, firebase });

		}

	}
}
