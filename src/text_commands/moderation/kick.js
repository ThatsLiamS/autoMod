const Discord = require('discord.js');

const mention = require(`${__dirname}/../../util/mention`);
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'kick',
	description: "Temporarily removes a member from the server!\nNote: They can rejoin if they have a invite code",
	usage: '<@member / id> [reason]',
	permissions: ["Kick Members"],
	aliases: ["k"],
	arguments: 1,
	async execute(message, args, prefix, client) {

		let errorMessage = false;

		let user = await mention.getUser(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}kick <@member> [reason]\`` });
			return;
		}
		const member = message.guild.members.cache.get(user.id);
		if(member) {
			if(member.id == message.author.id) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can not kick yourself" });
				return;
			}

			const reason = args[1] ? args.slice(1).join(" ") : "No reason specified";
			if(reason.length > 1024) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { content: `The reason specified was too long. Please keep reasons under 1024 characters` });
				return;
			}

			member.kick(`Moderator: ${message.author.tag} || Reason: ${reason}`).catch(async () => {
				await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Sorry, an error occured when trying to kick ${member.user.tag}` });

			}).catch().then(async () => {

				const channelkicked = new Discord.MessageEmbed()
					.setColor('#DC143C')
					.setTitle(`${member.user.tag} has been kicked`)
					.setAuthor(`${message.member.user.tag}`, `${message.member.user.displayAvatarURL()}`)
					.setThumbnail(member.user.displayAvatarURL())
					.addFields(
						{ name: '**Who:**', value: `${member} || ${member.user.tag}`, inline: true },
						{ name: '**Reason:**', value: `${reason}`, inline: true },
					)
					.setTimestamp();

				if(errorMessage == false) {
					await send.sendChannel({ channel: message.channel, author: message.author }, { contents: [channelkicked] });
				}
			});
		}
		else {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}kick <@member> [reason]\`` });
		}
	}
};