const { MessageEmbed } = require('discord.js');
const defaultData = require('./../../utils/defaults');

const options = {
	'10m': 10 * 60 * 1000, '1h': 3600 * 1000,
	'3h': 3 * 3600 * 1000, '6h': 6 * 3600 * 1000,
	'1d': 24 * 3600 * 1000, '1w': 7 * 24 * 3600 * 1000,
};

module.exports = {
	name: 'mute',
	description: 'Sets a temporary timeout for a user.',
	usage: '<user> <time> [reason]',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'user', description: 'Who are you wanting to mute?', type: 'USER', required: true },
		{ name: 'time', description: 'For how long?', type: 'STRING', choices: [
			{ name: '10 Minutes', value: '10m' }, { name: '1 Hour', value: '1h' },
			{ name: '3 Hours', value: '3h' }, { name: '6 Hours', value: '6h' },
			{ name: '1 Day', value: '1d' }, { name: '1 Week', value: '1w' },
		], required: true },
		{ name: 'reason', description: 'Why?', type: 'STRING', required: false },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {

		const member = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const time = options[interaction.options.getString('time')];

		member.timeout(time, reason)
			.then(async () => {

				const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
				const serverData = collection.data() || defaultData['guilds'];

				if (!serverData['moderation logs'][member.id]) serverData['moderation logs'][member.id] = [];
				serverData['moderation logs']['case'] = Number(serverData['moderation logs']['case']) + 1;

				const object = {
					type: 'mute',
					case: serverData['moderation logs']['case'],
					reason: reason,

					username: member.user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				serverData['moderation logs'][member.id] = [object].concat(serverData['moderation logs'][member.id]);
				await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);


				if (serverData['logs']['on'] == true) {
					const embed = new MessageEmbed()
						.setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL()}`)
						.setTitle(`⌛ Timeout - ${member.user.tag}`)
						.setColor('#DC143C')
						.addFields(
							{ name: '**User**', value: `${member.user.tag} (${member.id})`, inline: false },
							{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
							{ name: '**Reason**', value: `${reason}`, inline: false },
						)
						.setTimestamp();
					const channel = interaction.guild.channels.cache.get(serverData['logs'].channel);
					channel.send({ embeds: [embed] });
				}


				interaction.followUp({ content: `${member.user.tag} has been muted.`, ephemeral: true });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occurred, please double check my permissions.', ephemeral: true }));

	},
};