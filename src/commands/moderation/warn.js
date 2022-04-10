const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('./../../utils/defaults');
const mention = require('./../../utils/mentions.js');

module.exports = {
	name: 'warn',
	description: 'Warns a member.',
	usage: '`/warn <user> [reason]`',

	permissions: ['Kick Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns a user')

		.addStringOption(option => option.setName('user').setDescription('The user to warn - @mention or ID').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Why are we warning them?').setRequired(true)),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const userId = mention.getUserId({ string: interaction.options.getString('user') });
		const user = await client.users.fetch(userId).catch(() => { return; });
		if (!user) {
			interaction.followUp({ content: 'I am unable to find that user.' });
			return;
		}
		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';

		const logEmbed = new MessageEmbed()
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`⚠️ Warned: ${user.tag}`)
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
