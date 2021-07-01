const { getMentionedMember } = require(`${__dirname}/../../util/mention`);
const Discord = require('discord.js');
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'warn',
	description: "Warns a member from breaking the rules!",
	usage: '<@member> [reason]',
	permissions: ["Kick Members"],
	aliases: ["w"],
	arguments: 1,
	async execute(message, args, prefix, client) {
		let errorMessage = false;

		let user = await getMentionedMember(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}warn <@member> [reason]\`` });
			return;
		}
		const member = message.guild.members.cache.get(user.id);
		if(member) {

			if(member.id == message.author.id) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You can not warn yourself.` });
				return;
			}

			let reason = args.slice(1).join(" ");
			if(!reason) { reason = "No reason specified"; }
			if(reason.length > 1024) {
				await send.sendChannel({ channel: message.channel, author: message.author }, { content: `The reason specified was too long. Please keep reasons under 1024 characters` });
				return;
			}

			const userMessage = new Discord.MessageEmbed()
				.setTitle(`You have been warned!`)
				.setColor(`#DC143C`)
				.addFields(
					{ name:`**Moderator**`, value:`${message.member} || ${message.author.tag}` },
					{ name:`**Reason**`, value:`${reason}` }
				)
				.setFooter('Please make sure to follow the rules.');

			await send.sendUser(member.user, { embeds: [userMessage] });

			const channelMessage = new Discord.MessageEmbed()
				.setTitle(`${member.user.tag} has been warned`)
				.setColor(`#DC143C`)
				.addFields(
					{ name:`**User:**`, value:`${member} || ${member.user.tag}` },
					{ name:`**Moderator:**`, value:`${message.member} || ${message.author.tag}` },
					{ name:`**Reason:**`, value:`${reason}` }
				);

			await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [channelMessage] });
		}
	}
};