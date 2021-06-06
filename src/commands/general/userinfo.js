const { getMentionedMember } = require(`${__dirname}/../../util/mention`);
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	description: "Displays lots of cool information about the user!",
	usage: '[@member]',
	aliases: ["whois"],
	arguments: 0,
	async execute(message, args, prefix, client) {
		let errorMessage = false;

		let user = await getMentionedMember(client, args[0]);
		if(!user) {
			try { user = await client.users.fetch(args[0]); }
			catch(error) { errorMessage = true; }
		}
		if (!user || errorMessage == true) {
			user = message.author;
			errorMessage = false;
		}
		const member = await message.guild.members.cache.get(user.id);

		if(!member) {
			return message.channel.send('Sorry, an internal error has occured.').catch(() => {
				message.author.send('Sorry, an internal error has occured.').catch();
			});
		}

		let roles = '';
		member.roles.cache.forEach(role => {
			if (role.name != "@everyone") {
				roles += ` ${role} `;
			}
		});
		if(roles.length < 1) { roles = "none"; }

		const embed = new Discord.MessageEmbed()
			.setTitle(`${member.user.tag}'s Info`)
			.setThumbnail(member.user.displayAvatarURL())
			.setColor('GREEN')
			.addFields(
				{ name: '**Username**', value: `${member.user.tag}`, inline: true },
				{ name: '**User ID**', value: `${member.user.id}`, inline: true },
				{ name: `**Account Ping**`, value: `${member}`, inline: true },
				{ name: '**Created**', value: `${moment(member.user.createdAt).format("DD/MM/YYYY LTS") }`, inline: true },
				{ name: '**Roles**', value: `${roles}`, inline: false }
			)
			.setTimestamp()
			.setFooter(`Requested By ${message.member.user.tag}`);
		message.channel.send(embed).catch(() => {
			message.author.send(`I am unable to send messages in ${message.channel}, please move to another channel`).catch();
		}).catch();
	}
};
