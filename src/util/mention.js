async function getUser(client, mention) {
	if(!mention) { return; }

	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) { return; }

	const id = matches[1];
	const user = await client.users.fetch(id);

	if(user.partial) {
		await user.fetch();
	}

	return user;
}

async function getMember(guild, mention) {
	if(!mention) { return; }

	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) { return; }

	const id = matches[1];
	const member = await guild.members.cache.get(id);

	return member;
}

async function getChannel(guild, mention) {
	if(!mention) { return; }

	const matches = mention.match(/^<#(\d+)>$/);
	if (!matches) { return; }

	const id = matches[1];
	const channel = await guild.channels.cache.get(id);

	return channel;
}

async function getRole(guild, mention) {
	if(!mention) { return; }

	const matches = mention.match(/^<&(\d+)>$/);
	if (!matches) { return; }

	const id = matches[1];
	const channel = await guild.channels.cache.get(id);

	return channel;
}

module.exports = {
	getMember,
	getUser,
	getChannel,
	getRole
};
