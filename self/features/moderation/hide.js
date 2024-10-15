module.exports = {
    configuration: {
        name: 'hide',
        aliases: [],
        description: 'Hide a channel',
        syntax: 'hide',
        example: 'hide',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        message.channel.updateOverwrite(message.guild.roles.everyone, {
            VIEW_CHANNEL: false,
        });
        return session.grant(session, message, 'Channel hidden');
    },
};