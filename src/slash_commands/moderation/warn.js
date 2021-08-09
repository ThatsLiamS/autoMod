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
	name: 'warn',
	description: "Warns a member from breaking the rules!",
	permissions: ["Kick Members"],
	usage: '<user> [reason]',
	options: [
		{ name: 'member', description: 'Who are you warning?', type: 'USER', required: true },
		{ name: 'reason', description: 'What did they do?', type: 'STRING', required: false },
	],
	async execute(interaction, client, firestore) {

		await interaction.defer({ ephemeral: false });

		const user = interaction.options.getUser('member');

		if(user.id == interaction.member.id) {
			await sendErr({ name: `CommonSense`, message: `Cannot Warn Yourself` }, interaction, `I am unable to warn ${interaction.member.user.tag}`);
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
		let description = `${user.tag} (${user.id}) has been warned.\nThis been logged in ${logsChannel}`;

		const sendToUser = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`⚠️ You have been warned in ${interaction.guild.name}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.user.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		await send.sendUser(user, { embeds: [sendToUser] }).catch(() => {
			description += '\n\nI was unable to contact the target member.';
		});

		const logs = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`⚠️ Warned - ${user.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${user.tag} - ${user.id}`, inline: false },
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.user.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const server = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`⚠️ Warned - ${user.tag}`)
			.setColor('#DC143C')
			.setDescription(description)
			.setTimestamp();

		if(logsChannel && interaction.channel.id == logsChannel.id) {
			await interaction.followUp({ embeds: [logs] });
		}
		else if(logsChannel) {
			await interaction.followUp({ embeds: [server] });
			await send.sendChannel({ channel: logsChannel, author: interaction.member.user }, { embeds: [logs] });
		}
		else {
			await interaction.followUp({ embeds: [logs] });
		}
	}
};