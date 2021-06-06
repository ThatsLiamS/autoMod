const { getMentionedMember } = require(`${__dirname}/../../util/mention`);
const Discord = require('discord.js');

module.exports = {
	name: 'ban',
	description: "Permanently removes a member from the server!",
	usage: '<@member> [reason]',
	permissions: ["Ban Members"],
	aliases: ['hackban', "b", "permban", 'forceban'],
	arguments: 1,
	async execute(message, args, prefix, client) {

		let errorMessage = false;

		let user = await getMentionedMember(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			return message.reply(`Incorrect usage, make sure it follows the format: \`${prefix}ban <@member> [reason]\``).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
			}).catch();
		}

		if(user.id == message.author.id) {
			return message.reply("You can not ban yourself").catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
			}).catch();
		}

		let reason = args.slice(1).join(" ");
		if (reason.length < 1) { reason = "No reason specified"; }

		const channelBanned = new Discord.MessageEmbed()
			.setColor('#DC143C')
			.setTitle(`A Member Was Banned`)
			.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: '**Who?**', value: `${user} || ${user.tag}`, inline: true },
				{ name: '**Reason**', value: `${reason}`, inline: true },
			)
			.setTimestamp();

		try {
			await message.guild.members.ban(user, { days: 7, reason: `Moderator: ${message.author.tag} || Reason: ${reason}` });
		}
		catch (error) {
			errorMessage = true;
			message.channel.send(`An error occured when trying to ban ${user}`).catch(() => {
				message.author.send(`I am unable to ban that member.`);
			}).catch();
		}

		if(errorMessage == false) {
			message.channel.send(channelBanned).catch();
		}
	}
};