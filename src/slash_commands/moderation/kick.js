const Discord = require('discord.js');

const send = require(`${__dirname}/../../util/send`);

async function sendErr(err, interaction, desc) {

	const embed = new Discord.MessageEmbed()
		.setTitle(`An error has occured`)
		.setColor('RED')
		.setDescription(desc)
		.addFields({ name: `__Error:__`, value: `**${err.name}: ${err.message}**`, inline: false });

	await interaction.followUp({ embeds: [embed] });
}

module.exports = {
	name: 'kick',
	description: "Temporarily removes a member from the server!\nNote: They can rejoin if they have a invite code",
	permissions: ["Kick Members"],
	usage: '<user> [reason]',
	options: [
		{ name: 'member', description: 'Who are you kicking?', type: 'USER', required: true },
		{ name: 'reason', description: 'What did they do?', type: 'STRING', required: false },
	],
	async execute(interaction, client, firestore) {

		await interaction.defer({ ephemeral: false });

		const member = interaction.options.getMember('member');

		if(member.id == interaction.member.user.id) {
			await sendErr({ name: `CommonSense`, message: `Cannot Kick Yourself` }, interaction, `I am unable to kick ${member.user.tag}`);
			return;
		}

		let reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : "No reason specified";
		if(reason.length > 1024) {
			await interaction.followUp({ content: `The reason specified was too long. Please keep reasons under 1024 characters` });
			return;
		}
		reason = Discord.Util.cleanContent(reason, interaction);

		const db = await firestore.collection(`servers`).doc(`${interaction.guild.id}`).get();
		const data = db.data();

		const logsChannel = client.channels.cache.get(data.logs.channel);
		let description = `${member.user.tag} (${member.user.id}) has been kicked from the server.\nThis been logged in ${logsChannel}`;

		const sendToUser = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 You have been Kicked from ${interaction.guild.name}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.user.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		await send.sendUser(member.user, { embeds: [sendToUser] }).catch(() => {
			description += '\n\nI was unable to contact the target member.';
		});

		const logs = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 Banned - ${member.user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${member.user.tag} - ${member.user.id}`, inline: false },
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.user.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const server = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 Banned - ${member.user.tag}`)
			.setColor('#DC143C')
			.setDescription(description)
			.setTimestamp();

		member.kick(`Moderator: ${interaction.member.user.tag} - reason: ${reason}`).catch(async (err) => {

			await sendErr(err, interaction, `I am unable to kick ${member.user.tag}`);
			return;

		});

		if(logsChannel && interaction.channel.id == logsChannel.id) {
			await interaction.followUp({ embeds: [logs] });
		}
		else if(logsChannel) {
			await interaction.followUp({ embeds: [server] });
			await send.sendChannel({ channel: logsChannel, author: interaction.author }, { embeds: [logs] });
		}
		else {
			await interaction.followUp({ embeds: [logs] });
		}

	}
};