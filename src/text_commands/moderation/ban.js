const mention = require(`${__dirname}/../../util/mention`);
const send = require(`${__dirname}/../../util/send`);
const Discord = require('discord.js');

module.exports = {
	name: 'ban',
	description: "Permanently removes a member from the server!",
	usage: '<@member / id> [reason]',
	permissions: ["Ban Members"],
	aliases: ['hackban', "b", "permban", 'forceban'],
	arguments: 1,
	async execute(message, args, prefix, client) {

		let errorMessage = false;

		let user = await mention.getUser(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}

		if (!user || errorMessage == true) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { contant: `Incorrect usage, make sure it follows the format: \`${prefix}ban <@member> [reason]\`` });
			return;
		}
		if(user.id == message.author.id) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Im sorry, but you can not ban yourself.' });
		}

		let reason = args.slice(1).join(" ");
		if (reason.length < 1) {
			reason = "No reason specified";
		}

		const channelBanned = new Discord.MessageEmbed()
			.setColor('#DC143C')
			.setTitle(`${user.tag} has been banned`)
			.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: '**Who?**', value: `${user} || ${user.tag}`, inline: true },
				{ name: '**Reason**', value: `${reason}`, inline: true },
			)
			.setTimestamp();

		try {
			await message.guild.members.ban(user, {
				days: 7,
				reason: `Moderator: ${message.author.tag} || Reason: ${reason}`
			});
		}
		catch (error) {
			errorMessage = true;
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `An error has occured when trying to ban ${user.tag}` });
		}

		if(errorMessage == false) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [channelBanned] });
		}
	}
};