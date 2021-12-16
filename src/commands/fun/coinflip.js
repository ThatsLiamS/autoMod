const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'coinflip',
	description: 'Flip a coin!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	error: false,
	execute: async ({ interaction }) => {

		const embed = new MessageEmbed()
			.setColor('#CD7F32')
			.setAuthor(interaction.user.username, interaction.ser.displayAvatarURL())
			.setTitle('Coin Flipper!')
			.setFooter('Powered by Coin Flipper#1767')
			.setTimestamp();

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
			embed.setDescription('The coin landed on its side, very impressive!')
				.setThumbnail('https://assets.liamskinner.co.uk/coin/side.png');
		}

		interaction.followUp({ embeds: [embed], ephemeral: false });

	},
};
