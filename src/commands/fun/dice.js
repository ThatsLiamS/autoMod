module.exports = {
	name: 'dice',
	description: 'Roll a 6 sided die!',
	usage: '',

	permissions: [],
	ownerOnly: false,

	error: false,
	execute: ({ interaction }) => {

		const random = Math.floor(Math.random() * 6) + 1;
		interaction.reply({ files: [{ attachment: `https://assets.liamskinner.co.uk/dice/${random}.png`, name: `dice_${random}.png` }], ephemeral: true });

	},
};
