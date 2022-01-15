const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'meme',
	description: 'Receive a meme from r/memes!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,

	error: false,
	execute: async ({ interaction }) => {

		const { got } = await import('got');
		got('https://www.reddit.com/r/memes/random/.json').then(response => {
			const content = JSON.parse(response.body);

			const embed = new MessageEmbed()
				.setTitle(`${content[0].data.children[0].data.title}`)
				.setURL(`https://reddit.com${content[0].data.children[0].data.permalink}`)
				.setDescription(`👍 ${content[0].data.children[0].data.ups} 💬 ${content[0].data.children[0].data.num_comments}`)
				.setColor('RANDOM')
				.setImage(`${content[0].data.children[0].data.url}`)
				.setFooter({ text: 'Powered by kekbot#5882' });

			interaction.followUp({ embeds: [embed] });
		});

	},
};
