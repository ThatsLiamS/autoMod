const send = require(`${__dirname}/../../util/send`);
module.exports = {
	name: 'deploy_slash',
	description: "Deploy and update slash commands!",
	usage: '<location> [server ID]',
	developerOnly: true,
	aliases: ['update_slash', "deployslash", "updateslash"],
	arguments: 1,
	async execute(message, args, prefix, client) {

		if(args[0] == 'global') {
			console.log('lol');
		}
		else if(args[0] == 'server') {
			if(!args[1]) { return; }

			const data = [
				{
					name: 'about',
					description: 'Shows lots of cool information about the bot!',
				},
				{
					name: 'help',
					description: 'View all of my commands and extra details for individual commands!',
					options: [
						{
							name: 'command',
							description: 'Enter a command',
							type: 'STRING',
							required: false
						},
					]
				}
			];
			let error = false;

			try{
				await client.guilds.cache.get(args[1]).commands.set(data);
			}
			catch(err) {
				error = true;
				console.log(err);
			}

			if(error == false) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { contant: `Slash commands for Guild:${args[1]} have been updated!` });
			}

		}
	}
};