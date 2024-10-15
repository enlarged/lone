module.exports = {
    configuration: {
        name: 'unlock',
        aliases: [],
        description: 'Unlock a channel',
        syntax: 'unlock',
        example: 'unlock',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        message.channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: true,
        });
        return session.grant(session, message, 'Channel unlocked');
    },
};