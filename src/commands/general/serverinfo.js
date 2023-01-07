// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

const premiumTier = ['None', 'Level 1', 'Level 2', 'Level 3' ];
const mfaLevel = ['Off', 'On' ];
const verificationLevel = ['None.', 'Low: verified email required.', 'Medium: on Discord for 5 minutes.', 'High: on the server for 10 minutes.', 'Very High: verified phone number.' ];

module.exports = {
	name: 'serverinfo',
	description: 'Shows information about the server',
	usage: '`/serverinfo [server id]`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Shows information about the server!')
		.setDMPermission(false)

		.addStringOption(option => option.setName('id').setDescription('The server\'s ID ').setRequired(false)),

	cooldown: { time: 10, text: '10 seconds' },
	error: false,

	/**
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {Object} arguments
	 * @param {CommandInteraction} arguments.interaction
	 * @param {Client} arguments.client
	 * @returns {Boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Fetch the Guild's information */
		const id = interaction.options.getString('id') || interaction.guild;
		const guild = client.guilds.cache.get(id) || interaction.guild;

		/* How old is the guild? */
		const ageTimestamp = new Date().getTime() - guild.createdTimestamp;
		const age = `${Math.floor(ageTimestamp / 86400000)}d ${Math.floor(ageTimestamp / 3600000) % 24}h ${Math.floor(ageTimestamp / 60000) % 60}m ${Math.floor(ageTimestamp / 1000) % 60}s`;

		/* Creates an embed of information */
		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setAuthor({ name: `${interaction.member.user.username} (${interaction.member.id})`, iconURL: interaction.member.displayAvatarURL() })
			.setTitle(`${guild.name}'s Information`)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: '**Server Name**', value: `${guild.name}`, inline: true },
				{ name: '**Server ID**', value: `${guild.id}`, inline: true },
				{ name: '**Server Owner**', value: `<@!${guild.ownerId}>`, inline: true },

				{ name: '**Created At**', value: `${moment(guild.createdAt).format('DD/MM/YYYY LTS')}`, inline: true },
				{ name: '**Server Age**', value: `${age}`, inline: true },
				{ name: '**Highest Role**', value: `${guild.roles.highest}`, inline: true },

				{ name: '**Member Count**', value: `${guild.memberCount}/${guild.maximumMembers}`, inline: true },
				{ name: '**Emoji Count**', value: `${guild.emojis.cache.size}`, inline: true },
				{ name: '**Channel Count**', value: `${guild.channels.cache.size}`, inline: true },

				{ name: '**Verification Level**', value: `${verificationLevel[guild.verificationLevel]}`, inline: true },
				{ name: '**MFA Level**', value: `${mfaLevel[guild.mfaLevel]}`, inline: true },
				{ name: '**Nitro Boost Level**', value: `${premiumTier[guild.premiumTier]}`, inline: true },
			)
			.setFooter({ text: `Requested by ${interaction.member.user.tag}` })
			.setTimestamp();

		/* Attempts to fetch a Guild Invite */
		try {
			const channel = guild.channels.cache.filter(c => c.type == 5 || c.type == 0)?.first();
			const invite = await guild.invites.create(channel?.id, { maxAge: 3600, maxUses: 5 }).catch(() => {
				/* Do Nothing! */
			});
			embed.setURL(invite?.url);
		}
		catch (err) {
			/* ignore it :) */
		}

		/* Responds to the user */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
