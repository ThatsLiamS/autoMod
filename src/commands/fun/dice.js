const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'dice',
	description: 'Roll a 6 sided die!',
	usage: '',

	permissions: [],
	ownerOnly: false,

	error: false,
	execute: ({ interaction }) => {

		const random = Math.floor(Math.random() * 6) + 1;

		const embed = new MessageEmbed()
			.setTitle('Dice roll')
			.setColor()
			.setDescription(`You rolled a ${random}!`)
			.setImage(`https://assets.liamskinner.co.uk/dice/${random}.png`);

		interaction.reply({ embeds: [embed], ephemeral: true });

	},
};
