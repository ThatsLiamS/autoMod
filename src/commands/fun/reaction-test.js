const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const emojis = ['', '', '', '', ''];

module.exports = {
	name: 'reaction-test',
	description: 'Creates a reaction speed test., Then displays first few users to react!',
	usage: '<reactions> <usercount>',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('reaction-test')
		.setDescription('Creates a reactions-based speed test. Then displays first few users to react!')

		.addIntegerOption(option => option
			.setName('reactions')
			.setDescription('Amount of reactions to add')
			.setMin(1).setMax(5)
			.setRequired(true),
		)
		
		.addIntegerOption(option => option
			.setName('usercount')
			.setDescription('How many users to display?')
			.setMin(1).setMax(5)
			.setRequired(true),
		),

	error: false,
	execute: async ({ interaction }) => {

		const emojiCount = interaction.options.getInteger('reactions');
		const userCount = interaction.options.getInteger('usercount');

		/* Create the message and start the reactions */
		const preparingEmbed = new MessageEmbed()
			.setTitle('Preparing reaction test!')
			.setDescription('Please Wait, any reactions before the start are disqualified.');
		const message = interaction.followUp({ embeds: [preparingEmbed] });

		for(const emoji of emojis.slice(0, emojiCount)) {
			await message.react(emoji);
		}

		/* Select the emoji and edit the embed */
		const emoji = emojis[Math.floor(Math.random() * emojiCount)];

		const startingEmbed = new MessageEmbed()
			.setTitle('Reaction test in progess!')
			.setDescription(`Click the ${emoji} as fast as you can!\n\nThe first persons to react will be shown here.\n\nIf you have reacted before, you have likely been disqualified.`)
		await message.edit({ embeds: [startingEmbed] })

		/* Set up the filter */
		const filter = (reaction, user) => reaction.emoji.name === '👌';
		message.awaitReactions({ filter, time: 15_000, maxUsers: userCount })
			.then(collected => {
				/*  */
			});

	},
};
