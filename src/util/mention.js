async function getMentionedMember(client, mention) {
	if(!mention) { return; }

	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;

	const id = matches[1];
	const user = await client.users.fetch(id);
	if(user.partial) {
		await user.fetch();
	}
	return user;
}

module.exports = {
	getMentionedMember
};
