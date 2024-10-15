module.exports = {
    configuration: {
        name: 'topic',
        aliases: [],
        description: 'Set the topic of a channel',
        syntax: 'topic <topic>',
        example: 'topic Hi',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        const topic = args.join(' ');

        if (!topic) {
            return session.command(module.exports, session, message);
        }

        message.channel.setTopic(topic);
        return session.grant(session, message, `Topic set to ${topic}`);
    },
};