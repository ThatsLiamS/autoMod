/* GhostPing Validation Functions */

const validate = (member, message) => {
	return (!member.user.bot && member.id != message.author.id) ? member.toString() : null;
};

const filter = (r) => {
	return (r.toString().startsWith('<')) ? r.toString() : null;
};

module.exports = {
	filter,
	validate,
};
