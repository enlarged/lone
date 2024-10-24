module.exports = {
    configuration: {
        name: 'react',
        description: 'React to a message',
        syntax: 'react <message id> <emoji>',
        example: 'react 123456789012345678 😄',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {
        const messageId = args[0];
        const emoji = args[1];

        if (!messageId || !emoji) {
            return session.command(module.exports, session, message);
        }

        const targetMessage = await message.channel.messages.fetch(messageId);

        if (!targetMessage) {
            return session.warn(session, message, 'Message not found');
        }

        message.delete();
        targetMessage.react(emoji);
    },
};