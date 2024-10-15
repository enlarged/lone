module.exports = {
    configuration: {
        name: 'ping',
        aliases: ['ws'],
        description: 'Get the bot\'s latency to discord',
        syntax: 'ping',
        example: 'ping',
        module: 'information'
    },

    run: async (session, message, args) => {
        message.delete();
        message.channel.send(`${session.ws.ping}ms`)
    }
}