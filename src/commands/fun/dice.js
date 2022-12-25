const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'dice',
	description: 'Roll a 6 sided die!',
	usage: '`/dice`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a 6 sided die!')
		.setDMPermission(true),

	cooldown: { time: 0, text: 'None (0)' },
	error: false,
	execute: async ({ interaction }) => {

		const random = Math.floor(Math.random() * 6) + 1;
		const embed = new EmbedBuilder()
			.setTitle('Dice roll')
			.setDescription(`You rolled a ${random}!`)
			.setThumbnail(`https://assets.liamskinner.co.uk/dice/${random}.png`);

		interaction.followUp({ embeds: [embed], ephemeral: false });

	},
};
