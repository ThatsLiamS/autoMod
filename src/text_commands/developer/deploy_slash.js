const send = require(`${__dirname}/../../util/send`);


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

module.exports = {
	name: 'deploy_slash',
	description: "Deploy and update slash commands!",
	developerOnly: true,
	aliases: ['update_slash', "deployslash", "updateslash"],
	async execute(message, args, prefix, client) {

		let error = false;

		try{
			await await client.application.commands.set(data);
		}
		catch(err) {
			error = true;
		}


		if(error == false) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Global slash commands have been updated!\n\n**Note:** It may take up to an hour to reach all guilds.` });
		}
		else{
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, an error occured when executing that command.' });
		}

	}
};