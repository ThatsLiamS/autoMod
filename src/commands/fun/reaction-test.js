const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const emojis = ['🔴', '🟠', '🟢', '🔵', '🟣'];

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
			.setMinValue(1).setMaxValue(5)
			.setRequired(true),
		)
		
		.addIntegerOption(option => option
			.setName('usercount')
			.setDescription('How many users to display?')
			.setMinValue(1).setMaxValue(5)
			.setRequired(true),
		),

	error: false,
	execute: async ({ interaction }) => {

		const emojiCount = interaction.options.getInteger('reactions');
		const userCount = interaction.options.getInteger('usercount');
		let active = false;

		/* Create the message and start the reactions */
		const preparingEmbed = new MessageEmbed()
			.setTitle('Preparing reaction test!')
			.setColor('RED')
			.setDescription('Please wait while we begin the test!')
			.setFooter({ text: 'Any reactions before the test starts are disqualified.' });
		const message = await interaction.followUp({ embeds: [preparingEmbed] });

		for(const emoji of emojis.slice(0, emojiCount)) {
			await message.react(emoji);
		}

		/* Select the emoji and edit the embed */
		const emoji = emojis[Math.floor(Math.random() * emojiCount)];
		setTimeout(async () => {
			const startingEmbed = new MessageEmbed()
				.setTitle('Reaction test in progess!')
				.setColor('GREEN')
				.setDescription(`Click the ${emoji} as fast as you can!\n\nThe ** first${userCount == 1 ? 'user' : `${userCount} people`}** to react will be shown here.\n\nIf you have reacted before, you have likely been disqualified.`)
			await message.edit({ embeds: [startingEmbed] })
			active = true;
		}, 3000);
		

		/* Set up the filter */
		const filter = (reaction, user) => reaction.emoji.name === emoji && !user.bot;
		const collector = message.createReactionCollector({ filter, time: 10_000, maxUsers: userCount });

		const users = [];
		collector.on('collect', (reaction, user) => { if (active) { users.push(user); }});
		collector.on('end', async () => {

			/* Formats the fastest reactors */
			let data = '';
			if (users.length > 0) {
				for (let x = 1; x <= userCount ; x++) {
					data = data + `**${x}. ${users[x - 1].tag}**\n<@${users[x - 1].id}>\n`
				}
			}
			else { data = 'Whoops, seems like nobody reacted.'; }
			

			/* Display the fastest reactors! */
			const winnersEmbed = new MessageEmbed(message.embeds[0])
				.setTitle('Reaction test is over!')
				.setColor('BLUE')
				.setDescription(`Here's ${userCount == 1 ? 'the **first user' : `a list of the **first ${userCount} people`}** who reacted before anyone else.\n\n${data}`)
				.setFooter({ text: 'Thanks for playing!' });

			setTimeout(async () => {
				await message.edit({ embeds: [winnersEmbed] });
			}, 3000);
	
		});	
		
		return;
	},
};
