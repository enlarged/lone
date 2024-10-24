module.exports = {
    configuration: {
        name: 'snipe',
        aliases: [],
        description: 'Snipe a deleted message',
        syntax: 'snipe',
        example: 'snipe',
        module: 'utility',
    },
    run: async (session, message, args) => {
        const snipes = session.snipes.get(message.channel.id);

        if (!snipes || snipes.length === 0) {
            return session.warn(session, message, "There are no messages to snipe");
        }

        const latestSnipe = snipes[0];

        const { msg, time, image } = latestSnipe;

        message.channel.send({ content: `${msg.author.username} deleted:\n\n> ${msg.content}`})
    },
};