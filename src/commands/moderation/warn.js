const { MessageEmbed } = require('discord.js');
const defaultData = require('./../../utils/defaults');

module.exports = {
	name: 'warn',
	description: 'Warns a member.',
	usage: '<user> [reason]',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	options: [
		{ name: 'user', description: 'Who are you wanting to warn?', type: 'USER', required: true },
		{ name: 'reason', description: 'Why?', type: 'STRING', required: false },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {

		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`⚠️ Warned - ${user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${user.tag} (${user.id})`, inline: false },
				{ name: '**Moderator**', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const userEmbed = new MessageEmbed()
			.setTitle('⚠️ You have been warned!')
			.setColor('#DC143C')
			.addFields(
				{ name: '**Server**', value: `${interaction.guild} (${interaction.id})`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const serverData = collection.data() || defaultData['guilds'];

		if (!serverData['moderation logs'][user.id]) serverData['moderation logs'][user.id] = [];
		serverData['moderation logs']['case'] = Number(serverData['moderation logs']['case']) + 1;

		const object = {
			type: 'warn',
			case: serverData['moderation logs']['case'],
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
			const channel = interaction.guild.channels.cache.get(serverData['logs'].channel);
			channel.send({ embeds: [logEmbed] });
		}
		user.send({ embeds: [userEmbed] }).catch(() => { return; });

		interaction.followUp({ content: `${user.tag} has been warned.`, ephemeral: true });
	},
};
