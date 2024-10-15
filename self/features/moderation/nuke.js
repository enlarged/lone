module.exports = {
    configuration: {
        name: 'nuke',
        aliases: [],
        description: 'Nuke a channel',
        syntax: 'nuke',
        example: 'nuke',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        message.channel.clone().then(channel => {
            channel.setPosition(message.channel.position);
            message.channel.delete();
        });
    },
};