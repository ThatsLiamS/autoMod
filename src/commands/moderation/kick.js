const { getMentionedMember } = require(`${__dirname}/../../util/mention`);
const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	description: "Temporarily removes a member from the server!\nNote: They can rejoin if they have a invite code",
	usage: '<@member> [reason]',
	permissions: ["Kick Members"],
	aliases: ["k"],
	arguments: 1,
	async execute(message, args, prefix, client) {

		let errorMessage = false;

		let user = await getMentionedMember(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			return message.channel.send(`Incorrect usage, make sure it follows the format: \`${prefix}kick <@member> [reason]\``).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
			}).catch();
		}
		const member = message.guild.members.cache.get(user.id);
		if(member) {
			if(member.id == message.author.id) {
				return message.channel.send("You can not kick yourself").catch(() => {
					message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
				}).catch();
			}

			let reason = args.slice(1).join(" ");
			if (reason.length < 1) { reason = "No reason specified"; }

			member.kick({ reason: `Moderator: ${message.author.tag} || Reason: ${reason}` }).catch(() => {
				message.channel.send(`Sorry, an error occured when trying to kick ${member.user.tag}`).catch(() => {
					message.author.send(`I am unable to kick that member.`);
				}).catch();
				errorMessage = true;
			}).then(() => {

				const channelkicked = new Discord.MessageEmbed()
					.setColor('#DC143C')
					.setTitle(`A Member Was Kicked`)
					.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
					.setThumbnail(member.user.displayAvatarURL())
					.addFields(
						{ name: '**Who:**', value: `${member} || ${member.user.tag}`, inline: true },
						{ name: '**Reason:**', value: `${reason}`, inline: true },
					)
					.setTimestamp();

				if(errorMessage == false) {
					message.channel.send(channelkicked).catch();
				}
			});
		}
		else {
			message.channel.send(`Incorrect usage, make sure it follows the format: \`${prefix}kick <@member> [reason]\``).catch();
		}
	}
};