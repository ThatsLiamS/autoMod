const { MessageEmbed } = require('discord.js');
const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'ban',
	description: 'Bans a member from the server.',
	usage: '<user> [reason]',

	permissions: ['Ban Members'],
	ownerOnly: false,

	options: [
		{ name: 'user', description: 'Who are you wanting to ban?', type: 'USER', required: true },
		{ name: 'reason', description: 'Why?', type: 'STRING', required: false },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {
		await interaction.deferReply({ ephermal: true });

		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new MessageEmbed()
			.setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL()}`)
			.setTitle(`🔨 Banned - ${user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		interaction.guild.members.ban(user, { days: 0, reason: `Mod: ${interaction.user.tag}\nReason: ${reason}` })
			.then(async () => {

				const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
				const serverData = collection.data() || defaultData['guilds'];

				if (!serverData['moderation logs'][user.id]) serverData['moderation logs'][user.id] = [];
				const caseNumber = serverData['moderation logs'][user.id].length;

				const object = {
					type: 'ban',
					case: caseNumber,
					reason: reason,

					username: user.tag,
					time: new Date(),

					moderator: {
						username: interaction.user.tag,
						id: interaction.user.id,
					},
				};
				serverData['moderation logs'][user.id] = [object].concat(serverData['moderation logs'][user.id]);
				await firestore.doc(`/guilds/${interaction.guild.id}`).set(serverData);

				if (serverData['logs']['on'] == true) {
					const channel = interaction.guild.channels.cache.get(serverData['logs'].id);
					channel.send({ embeds: [logEmbed] });
				}

				interaction.followUp({ content: `${user.tag} has been banned.` });
			})
			.catch(() => interaction.followUp({ content: 'Sorry, an error has occured, please double check my permissions.' }));
	},
};
