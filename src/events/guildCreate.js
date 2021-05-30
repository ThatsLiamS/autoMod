const Discord = require('discord.js')
const { guildCreate } = require(`${__dirname}/../util/developer/test`)

module.exports = {
	name: 'guildCreate',
	async execute(guild, client, firestore) {
        guildCreate(guild, firestore)
    }
}