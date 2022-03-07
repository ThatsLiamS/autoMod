const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'dice',
	description: 'Roll a 6 sided die!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a 6 sided die!'),

	error: false,
	execute: async ({ interaction }) => {

		const random = Math.floor(Math.random() * 6) + 1;
		const embed = new MessageEmbed()
			.setTitle('Dice roll')
			.setDescription(`You rolled a ${random}!`)
			.setThumbnail(`https://assets.liamskinner.co.uk/dice/${random}.png`);

		interaction.followUp({ embeds: [embed], ephemeral: false });

	},
};
