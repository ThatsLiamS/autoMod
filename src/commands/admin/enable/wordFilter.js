module.exports = {
    name: 'wordFilter',
    permissions: ["Admin"],
    async execute(message, args, prefix, client, firestore){

      if(!args[1]) return message.reply(`Please include the channel where logs are sent to.\n\`${prefix}enable word-filter <channel>\``)

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
      if(!channel) return message.reply('Channel not found.')
      
      let level = 'soft'

        await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
            wordFilter: {
              on: true,
              channel: channel.id,
              level: level,
            }
        })
        message.channel.send(`The word-filter has been turned on. All logs will be sent to ${channel}`)
    }
}
