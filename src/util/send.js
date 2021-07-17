const Discord = require('discord.js');
const { bot } = require(`${__dirname}/values`);

async function sendChannel(values, object) {

	const channel = values.channel;
	const author = values.user;

	const message = await channel.send(object).catch(() => {
		sendUser(author, { content: `An error occured when sending a message in ${channel}.\nPlease make sure I have permission to \`SEND_MESSAGES\` and \`EMBED_LINKS\`.` });
	});

	return message;
}

async function sendWebhook(values, object) {

	const webhook = values.webhook;
	const message = values.message;

	const sent = await webhook.send(object).catch(() => {
		sendChannel({ channel: message.channel, user: message.author }, { content: `An internal error occured during that command. Please join our support server at ${bot.server}` });
	}).catch();

	return sent;
}

async function sendUser(user, object) {

	if(!user || user == 'n/a') { return false; }

	const message = await user.send(object).catch(() => {});

	return message;
}

async function error(err, channel, desc) {

	const embed = new Discord.MessageEmbed()
		.setTitle(`An error has occured`)
		.setColor('RED')
		.setDescription(desc)
		.addFields(
			{ name: `__Error:__`, value: `**${err.name}: ${err.message}**`, inline: false },
		);

	const message = await channel.send({ embeds: [embed] });
	return message ? message : false;
}

module.exports = {
	sendChannel,
	sendWebhook,
	sendUser,
	error
};