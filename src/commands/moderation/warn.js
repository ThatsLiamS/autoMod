const { getMentionedMember } = require(`${__dirname}/../../util/mention`);
const Discord = require('discord.js');

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
			return message.channel.send(`Incorrect usage, make sure it follows the format: \`${prefix}warn <@member> [reason]\``).catch(() => {
				message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`);
			}).catch();
		}
		const memberTarget = message.guild.members.cache.get(user.id);
		if(memberTarget) {

			let reason = args.slice(1).join(" ");
			if(!reason) { reason = "No reason specified"; }
			if(reason.length > 1024) {
				return message.channel.send("The reason specified was too long. Please keep reasons under 1024 characters").catch(() => {
					message.author.send(`The reason specified was too long. Please keep reasons under 1024 characters`).catch();
				});
			}

			const userMessage = new Discord.MessageEmbed()
				.setTitle(`You have been warned!`)
				.setColor(`#DC143C`)
				.addFields(
					{ name:`**Moderator**`, value:`${message.member} || ${message.author.tag}` },
					{ name:`**Reason**`, value:`${reason}` }
				)
				.setFooter('Please make sure to follow the rules.');

			memberTarget.user.send(userMessage).catch(() => {
				errorMessage = true;
			}).catch();

			const channelMessage = new Discord.MessageEmbed()
				.setTitle(`${memberTarget.user.tag} has been warned`)
				.setColor(`#DC143C`)
				.addFields(
					{ name:`**User:**`, value:`${memberTarget} || ${memberTarget.user.tag}` },
					{ name:`**Moderator:**`, value:`${message.member} || ${message.author.tag}` },
					{ name:`**Reason:**`, value:`${reason}` }
				);

			if(errorMessage == false) {
				message.channel.send(channelMessage).catch(() => {
					message.author.send(`I can't send messages in that channel`, channelMessage).catch();
				});
			}
			else {
				message.channel.send('Sorry, an error occured when warning them.').catch(() => {
					message.author.send(`Sorry, an error occured when warning them.`).catch();
				});
			}
		}
	}
};