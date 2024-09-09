module.exports = {
    configuration: {
        name: 'spam',
        aliases: [],
        description: 'Spam a message in a channel',
        syntax: 'spam <amount> (message)',
        example: 'spam 99 silly goose',
        module: 'utility',
    },
    run: async (session, message, args) => {
        const amount = parseInt(args[0]);
        const content = args.slice(1).join(' ');

        message.delete();

        if (!amount || amount < 1 || amount > 100) {
            return message.react('❌');
        }

        if (!content) {
            return message.react('❌');
        }

        for (let i = 0; i < amount; i++) {
            message.channel.send(content);
        }
    },
};