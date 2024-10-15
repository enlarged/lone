module.exports = {
    configuration: {
        name: 'unhide',
        aliases: [],
        description: 'Unhide a channel',
        syntax: 'unhide',
        example: 'unhide',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        message.channel.updateOverwrite(message.guild.roles.everyone, {
            VIEW_CHANNEL: true
        }).then(() => {
            return session.grant(session, message, 'Channel unhidden');
        });
    },
};