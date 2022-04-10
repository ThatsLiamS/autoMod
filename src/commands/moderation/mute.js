const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const defaultData = require('./../../utils/defaults');
const mention = require('./../../utils/mentions.js');

const options = {
	's': 1000, 'm': 60 * 1000,
	'h': 3600 * 1000, 'd': 24 * 3600 * 1000,
	'w': 7 * 24 * 3600 * 1000,
};

module.exports = {
	name: 'mute',
	description: 'Sets a temporary timeout for a user.',
	usage: '`/mute <member> <duration> <units> [reason]`',

	permissions: ['Moderator Members'],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Applies a timeout to a user')

		.addStringOption(option => option.setName('member').setDescription('The member to mute - @mention or ID').setRequired(true))
		.addIntegerOption(option => option.setName('duration').setDescription('How long for?').setRequired(true))
		.addStringOption(option => option
			.setName('units').setRequired(true)
			.setDescription('How long for?')
			.addChoice('Seconds', 's')
			.addChoice('Minutes', 'm').addChoice('Hours', 'h')
			.addChoice('Days', 'd').addChoice('Weeks', 'w'),
		)
		.addStringOption(option => option.setName('reason').setDescription('Why are we muting them?')),


	error: false,
	execute: async ({ interaction, firestore }) => {

		const userId = mention.getUserId({ string: interaction.options.getString('member') });
		const member = interaction.guild.members.cache.get(userId);
		if (!member) {
			return interaction.followUp({ content: 'I am unable to find that member.' });
		}

		const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'No reason specified';
		const time = interaction.options.getInteger('duration') * options[interaction.options.getString('units')];

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
						.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`⌛ Timeout: ${member.user.tag}`)
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