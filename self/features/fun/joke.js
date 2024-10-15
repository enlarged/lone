const jokee = require('discord-jokes')

module.exports = {
    configuration: {
        name: 'joke',
        description: 'Get a random joke',
        syntax: 'joke',
        example: 'joke',
        aliases: ['jk'],
        module: 'fun'
    },
    run: async (session, message) => {
        jokee.getRandomDadJoke (dadjoke => {
            message.delete();
            message.channel.send(`${dadjoke}`) 
        })
    }
}