/* Get ID from the mention format: <@0000> */
const getUserId = ({ string }) => {

	const matches = string.match(/^<@!?(\d+)>$/);
	return matches ? matches[1] : string;

};

module.exports = {
	getUserId,
};
