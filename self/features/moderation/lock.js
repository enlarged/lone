module.exports = {
    configuration: {
        name: 'lock',
        aliases: [],
        description: 'Lock a channel',
        syntax: 'lock',
        example: 'lock',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        message.channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: false
        }).then(() => {
            return session.grant(session, message, 'Channel locked');
        });
    },
};