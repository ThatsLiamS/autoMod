module.exports = {
	name: 'messageCreate',
	once: false,

	execute: async (message) => {

		/* Suggestion Channel */
		if (message.channel.id == '821153396328366080') {
			await message.react('<:yes:902869579850735656>');
			await message.react('<:no:902869579817173023>');
		}

		/* Annoucement Channel */
		if (message.channel.id == '821153011890913310') {
			await message.react('👍');
			await message.react('<:tada:902870056801828914>');
		}

		/* Chain-message Channel */
		if (message.channel.id == '821162869709864961') {
			if (!message.content == '<:agh:825361464008245299>') message.delete();
		}


	},
};
