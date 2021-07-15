const Discord = require('discord.js');
const moment = require('moment');

const mention = require(`${__dirname}/../../util/mention`);
const send = require(`${__dirname}/../../util/send`);

module.exports = {
	name: 'userinfo',
	description: "Displays lots of cool information about the user!",
	usage: '[@member / id]',
	aliases: ["whois"],
	arguments: 0,
	async execute(message, args, prefix, client) {
		let errorMessage = false;

		let user = await mention.getUser(client, args[0]);
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
			await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, an interal error has occured.' });
			return;
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

		await send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};