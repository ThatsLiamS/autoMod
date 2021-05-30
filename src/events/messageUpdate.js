const Discord = require('discord.js');
const GhostPing = require('discord.js-ghost-ping');

const { wordFilter } = require(`${__dirname}/../util/wordFilter`)

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage, client, firestore) {

        try{
            GhostPing.detector("messageUpdate", oldMessage, newMessage)
        } catch(err){}
        
        wordFilter(newMessage, firestore)
    }
};