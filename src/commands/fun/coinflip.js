// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'coinflip',
	description: 'Flip a coin!',
	usage: '/coinflip',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin!')
		.setDMPermission(true),

	cooldown: { time: 0, text: 'None (0)' },
	defer: { defer: true, ephemeral: true },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @returns {Boolean}
	**/
	execute: async ({ interaction }) => {

		const embed = new EmbedBuilder()
			.setColor('#CD7F32')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Coin Flipper!')
			.setFooter({ text: 'Powered by Coin Flipper#1767' })
			.setTimestamp();

		/* Generates a random number */
		const random = Math.floor(Math.random() * 100);
		if (random > 50) {
			embed.setDescription('The coin landed on heads!')
				.setThumbnail('https://assets.liamskinner.co.uk/coin/heads.png');
		}
		else if (random < 50) {
			embed.setDescription('The coin landed on tails!')
				.setThumbnail('https://assets.liamskinner.co.uk/coin/tails.png');
		}
		else {
			/* 1 in 100 chance */
			embed.setDescription('The coin landed on its side, very impressive!')
				.setThumbnail('https://assets.liamskinner.co.uk/coin/side.png');
		}

		/* Responds to the user */
		interaction.followUp({ embeds: [embed], ephemeral: false });
		return true;

	},
};
