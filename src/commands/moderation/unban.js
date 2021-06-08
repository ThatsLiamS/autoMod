const { getMentionedMember } = require(`${__dirname}/../../util/mention`);
const Discord = require('discord.js');

module.exports = {
	name: 'unban',
	description: "Unbans a member from the server and allows them to rejoin!",
	usage: '<user ID> [reason]',
	permissions: ["Ban Members"],
	arguments: 1,
	async execute(message, args, prefix, client) {

		let errorMessage = false;

		let user = await getMentionedMember(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			return message.reply(`Incorrect usage, make sure it follows the format: \`${prefix}unban <user ID> [reason]\``).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
			}).catch();
		}

		let reason = args.slice(1).join(" ");
		if (reason.length < 1) { reason = "No reason specified"; }

		const channelUnbanned = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`A Member Was Unbanned`)
			.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: '**Who?**', value: `${user} || ${user.tag}`, inline: true },
				{ name: '**Reason**', value: `${reason}`, inline: true },
			)
			.setTimestamp();

		try {
			await message.guild.members.unban(user.id);
		}
		catch (error) {
			errorMessage = true;
			message.channel.send(`An error occured when trying to unban \`${user.tag}\``).catch(() => {
				message.author.send(`I am unable to ban that member.`);
			}).catch();
		}

		if(errorMessage == false) {
			message.channel.send(channelUnbanned).catch();
		}
	}
};