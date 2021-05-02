module.exports = {
    name: 'wordFilter',
    description: "",
    aliases: [],
    usage: '',
    permissions: ["Admin"],
    async execute(message, args, prefix, client, firestore, data){

        await firestore.collection(`servers`).doc(`${message.guild.id}`).update({
            wordFilter: {
              on: false
            }
        })
        message.reply('The `word-filter` has been turned off.')
    }
}
