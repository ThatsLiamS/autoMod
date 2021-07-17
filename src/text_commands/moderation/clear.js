const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'clear',
	description: "Bulk delete messages",
	usage: '<number 1-100>',
	permissions: ["Manage Messages"],
	aliases: ["purge"],
	arguments: 1,
	async execute(message, args, prefix) {

		const number = args[0];

		if(isNaN(number)) {
			await send.error({ name: `TypeError`, message: `Argument Must Be Number` }, message.channel, `Usage: ${prefix}${this.name} ${this.usage}`);
			return;
		}

		if(number < 1 || 100 < number) {
			await send.error({ name: `TypeError`, message: `Number Out Of Bounds` }, message.channel, `Usage: ${prefix}${this.name} ${this.usage}`);
			return;
		}

		message.channel.bulkDelete(number).catch(async (err) => {
			await send.error(err, message.channel, `Unable to delete **${number}** messages.`);
			return;
		});

	}
};