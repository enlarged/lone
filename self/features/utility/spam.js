module.exports = {
    configuration: {
        name: 'spam',
        aliases: [],
        description: 'Spam a message in a channel',
        syntax: 'spam <amount> <message> [--clients | --all]',
        example: 'spam 10 hi --clients',
        module: 'utility',
    },
    run: async (session, message, args) => {
        const amount = parseInt(args[0]);
        const content = args.slice(1).filter(arg => !arg.startsWith('--')).join(' ');
        const clientsOnly = args.includes('--clients');
        const all = args.includes('--all');

        message.delete();

        if (!amount || amount < 1 || amount > 100) {
            return session.command(module.exports, session, message);
        }

        if (!content) {
            return session.command(module.exports, session, message);
        }

        for (let i = 0; i < amount; i++) {
            if (!clientsOnly || all) {
                message.channel.send(content);
            }

            if (clientsOnly || all) {
                for (const client of session.clients) {
                    try {
                        client.channels.cache.get(message.channel.id).send(content);
                    } catch (error) {
                        console.error(`Error sending message with client ${client.user.username}: ${error.message}`);
                    }
                }
            }
        }
    },
};