const { bot } = require(`${__dirname}/values`);

async function sendChannel(values, object) {
	const channel = values.channel;
	const author = values.user;

	let result = true;

	let messageContent = {};

	if(object.content) { messageContent.content = object.content; }
	if(object.embed) { messageContent.embed = object.embed; }

	await channel.send(messageContent).catch(() => {
		result = false;
		sendUser(author, {
			content: `An error occured when sending a message in ${channel}.\nPlease make sure I have permission to \`SEND_MESSAGES\` and \`EMBED_LINKS\`.`
		});
	}).catch();

	return result;
}

async function sendWebhook(values, object) {
	let result = true;

	const webhook = values.webhook;
	const message = values.message;

	let webhookContent = {};

	if(object.username) { webhookContent.username = object.username; }
	if(object.avatarURL) { webhookContent.avatarURL = object.avatarURL; }
	if(object.username) { webhookContent.username = object.username; }

	await webhook.send(webhookContent).catch(() => {
		result = false;
		sendChannel({
			channel: message.channel,
			user: message.author
		},
		{
			content: `An internal error occured during that command. Please join our support server at ${bot.server}`
		});
	}).catch();

	return result;
}

async function sendUser(user, object) {
	let messageContent = {};
	let result = true;

	if(!user || user == 'n/a') { return result; }

	if(object.content) { messageContent.content = object.content; }
	if(object.embed) { messageContent.embed = object.embed; }

	await user.send(messageContent).catch(() => {
		result = false;
	}).catch();

	return result;
}


module.exports = {
	sendChannel,
	sendWebhook,
	sendUser
};