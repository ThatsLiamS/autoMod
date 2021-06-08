module.exports = {
	name: 'clear',
	description: "Bulk delete messages",
	usage: '<number 1-100>',
	permissions: ["Manage Messages"],
	aliases: ["purge"],
	arguments: 1,
	async execute(message, args) {

		if (Number(args[0]) > 100) {
			return message.reply(`I'm sorry, I have a limit of 100 messages per command.`).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`).catch();
			}).catch();
		}

		await message.delete().catch();
		message.channel.bulkDelete(args[0]).catch(() => {
			message.channel.send('I can not delete messages over 14 days old').catch();
		}).catch();
	}
};