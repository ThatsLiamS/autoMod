const Discord = require('discord.js');

const mention = require(`${__dirname}/../../util/mention`);
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'unban',
	description: "Unbans a member from the server and allows them to rejoin!",
	usage: '<user ID> [reason]',
	permissions: ["Ban Members"],
	arguments: 1,
	async execute(message, args, prefix, client) {

		let errorMessage = false;

		let user = await mention.getUser(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}unban <user ID> [reason]\`` });
			return;
		}

		const reason = args[1] ? args.slice(1).join(" ") : "No reason specified";

		const channelUnbanned = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`${user.tag} has been unbanned`)
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
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Sorry, an error occured when trying to unban \`${user.tag}\`` });
		}

		if(errorMessage == false) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [channelUnbanned] });
		}
	}
};