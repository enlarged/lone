module.exports = {
    configuration: {
        name: 'slowmode',
        aliases: ['sm'],
        description: 'Set the slowmode of a channel',
        syntax: 'slowmode <time>',
        example: 'slowmode 5',
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const time = parseInt(args[0]);
        if (!time) {
            return message.react('❌');
        }

        message.channel.setRateLimitPerUser(time);
        message.react('✅');
    }
};