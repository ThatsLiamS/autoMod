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
	name: 'unban',
	description: "Unbans a member from the server and allows them to rejoin!",
	permissions: ["Ban Members"],
	options: [
		{ name: 'user', description: 'Who are you unbanning? (ID ONLY)!', type: 'STRING', required: true },
		{ name: 'reason', description: 'Tell us why', type: 'STRING', required: false },
	],
	async execute(interaction, client) {

		await interaction.defer({ ephemeral: false });

		const id = interaction.options.getString('user');
		const target = client.users.fetch(id);

		if(!target) {
			await sendErr({ name: `UnkownMember`, message: `Invalid User ID Provided` }, interaction, `Please double check the user ID and try again.`);
			return;
		}

		let reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : "No reason specified";
		if(reason.length > 1024) {
			await interaction.followUp({ content: `The reason specified was too long. Please keep reasons under 1024 characters` });
			return;
		}
		reason = Discord.Util.cleanContent(reason, interaction);

		const logs = new Discord.MessageEmbed()
			.setAuthor(`${interaction.member.user.tag}`, `${interaction.member.user.displayAvatarURL()}`)
			.setTitle(`🔨 Unbanned - ${target.tag}`)
			.setColor('GREEN')
			.addFields(
				{ name: '**User**', value: `${target.tag} - ${target.id}`, inline: false },
				{ name: '**Moderator**', value: `${interaction.member.user.tag} - ${interaction.member.id}`, inline: false },
				{ name: '**Reason**', value: `${reason}`, inline: false },
			)
			.setTimestamp();

		try {
			await interaction.guild.members.unban(target.id);
		}
		catch (error) {
			await interaction.followUp({ content: `Sorry, an error occured when trying to unban \`${target.tag}\`` });
			return;
		}

		await interaction.followUp({ embeds: [logs] });

	}
};