const Discord = require('discord.js');

async function sendErr(err, interaction, desc) {

	const embed = new Discord.MessageEmbed()
		.setTitle(`An error has occured`)
		.setColor('RED')
		.setDescription(desc)
		.addFields(
			{ name: `__Error:__`, value: `**${err.name}: ${err.message}**`, inline: false },
		);

	await interaction.followUp({ embeds: [embed] });
}

module.exports = {
	name: 'ban',
	description: "Permanently removes a member from the server!",
	permissions: ["Ban Members"],
	options: [
		{ name: 'member', description: 'Who are you banning (ID only)!', type: 'STRING', required: true },
		{ name: 'reason', description: 'Tell us why', type: 'STRING', required: false },
	],
	async execute(interaction, client, firestore) {

		await interaction.defer({ ephemeral: false });

		const id = interaction.options.getString('member');
		const target = client.users.fetch(id);

		if(!target) {
			await sendErr({ name: `UnkownMember`, message: `Invalid User ID Provided` }, interaction, `Please double check the user ID and try again.`);
			return;
		}

		if(target.id == interaction.member.id) {
			await sendErr({ name: `CommonSense`, message: `Cannot Ban Yourself` }, interaction, `I am unable to ban ${target.tag}`);
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

		let description = `${target.tag} (${target.id}) has been banned from the server.`;
		if(logsChannel) { description += `\nThis been logged in ${logsChannel}`; }

		const sendToUser = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 You have been banned from ${interaction.guild.name}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		await target.send({ embeds: [sendToUser] }).catch(() => {
			description += '\n\nI was unable to contact the target member.';
		});

		const logs = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 Banned - ${target.tag}`)
			.setColor('#DC143C')
			.addFields(
				{ name: '**User**', value: `${target.tag} - ${target.id}`, inline: false },
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		const server = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 Banned - ${target.tag}`)
			.setColor('#DC143C')
			.setDescription(description)
			.setTimestamp();

		try {

			await interaction.guild.members.ban(target, { days: 7, reason: `Moderator: ${interaction.member.user.tag} --  reason: ${reason}` });
		}
		catch(err) {

			await sendErr(err, interaction, `I am unable to ban ${target.tag}`);
			return;
		}


		if(logsChannel && interaction.channel.id == logsChannel.id) {
			await interaction.followUp({ embeds: [logs] });
		}
		else if(logsChannel) {
			await interaction.followUp({ embeds: [server] });
			await logsChannel.send({ embeds: [logs] }).catch(async () => {
				await sendErr({ name: `unableToLog`, message: `Unable To Log Action` }, interaction, `Please make sure I have permission to view and send messages in the channel.`);
				return;
			});
		}
		else {
			await interaction.followUp({ embeds: [logs] });
		}

	}
};