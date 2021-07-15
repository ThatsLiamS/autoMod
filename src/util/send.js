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
	let messageContent = {};

	if(!user || user == 'n/a') { return; }

	if(object.content) { messageContent.content = object.content; }
	if(object.embed) { messageContent.embed = object.embed; }

	const message = await user.send(messageContent).catch(() => { });

	return message;
}


module.exports = {
	sendChannel,
	sendWebhook,
	sendUser
};