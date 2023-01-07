// eslint-disable-next-line no-unused-vars
const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'meme',
	description: 'Receive a meme from r/memes!',
	usage: '/meme',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Receive a meme from r/memes!')
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

		/* Dynamically import the module */
		const { got } = await import('got');
		return got('https://www.reddit.com/r/memes/random/.json').then(response => {
			const content = JSON.parse(response.body);

			/* Create the embed full of the API data */
			const embed = new EmbedBuilder()
				.setTitle(`${content[0].data.children[0].data.title}`)
				.setURL(`https://reddit.com${content[0].data.children[0].data.permalink}`)
				.setDescription(`👍 ${content[0].data.children[0].data.ups}    💬 ${content[0].data.children[0].data.num_comments}`)
				.setColor('Random')
				.setImage(`${content[0].data.children[0].data.url}`)
				.setFooter({ text: 'Powered by kekbot#5882' });

			/* Responds to the user */
			interaction.followUp({ embeds: [embed] });
			return true;
		});

	},
};
