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
	name: 'slowmode',
	description: "Change the slowmode time in the channel!",
	permissions: ["Manage Channels"],
	options: [
		{ name: 'amount', description: 'How long should slowmode be? (In seconds)!', type: 'INTEGER', required: true },
	],
	async execute(interaction) {

		await interaction.defer({ ephemeral: false });

		const amount = interaction.options.getInteger('amount');

		if(amount < 1 || 21600 < amount) {
			await sendErr({ name: `TypeError`, message: `Number Out Of Bounds` }, interaction, `Please provide a whole number between 1 and 21600 (6 hours).`);
			return;
		}

		await interaction.channel.setRateLimitPerUser(amount).catch(async (err) => {
			await sendErr(err, interaction, `I am unable to turn off slowmode.`);
			return;
		});

		const completed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription(`I have sucessfully set the slowmode to ${amount}s`);

		await interaction.followUp({ embeds: [completed] });

	}
};