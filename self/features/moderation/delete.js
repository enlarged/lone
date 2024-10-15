module.exports = {
    configuration: {
        name: 'delete',
        aliases: ['del'],
        description: 'Delete a channel',
        syntax: 'delete <channel>',
        example: 'delete #general',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        if (!channel) {
            return session.command(module.exports, session, message);
        }

        channel.delete();
        return session.grant(session, message, `Channel ${channel.name} deleted`);
    },
};