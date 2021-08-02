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
	name: 'purge',
	description: "Bulk delete messages",
	permissions: ["Manage Messages"],
	options: [
		{ name: 'amount', description: 'How many messages do I delete!', type: 'INTEGER', required: true },
	],
	async execute(interaction) {

		await interaction.defer({ ephemeral: true });

		const amount = interaction.options.getInteger('amount');

		if(amount < 1 || 100 < amount) {
			await sendErr({ name: `TypeError`, message: `Number Out Of Bounds` }, interaction, `Please provide a number between 1 and 100.`);
			return;
		}

		interaction.channel.bulkDelete(amount).catch(async (err) => {
			await sendErr(err, interaction, `Unable to delete **${amount}** messages.`);
			return;
		});

		const embed = new Discord.MessageEmbed()
			.setFooter(`Successfully deleted **${amount}** messages.`)
			.setColor();

		await interaction.followUp({ embeds: [embed] });
		return;

	}
};