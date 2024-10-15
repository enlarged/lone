module.exports = {
    configuration: {
        name: 'giphy',
        aliases: ['gif'],
        description: 'Search Giphy for a GIF',
        syntax: 'giphy <query>',
        example: 'giphy cat',
        module: 'miscellaneous',
    },
    run: async (session, message, args) => {
        const giphy = require('giphy')('4jpa0aSb0eF3ZQ0BUz4ngrGhuoYScG31');
        const query = args.join(' ');

        if (!query) {
            return session.command(module.exports, session, message)
        }

        try {
            message.delete();
            giphy.search({ q: query }, (err, response) => {
                if (err) {
                    console.error('Error searching Giphy:', err);
                    return message.react('❌');
                }

                if (!response || response.data.length === 0) {
                    return message.react('❌');
                }

                const gif = response.data[0];

                message.channel.send({ content: gif.url });
            });
        } catch (error) {
            session.log('Error searching Giphy:', error);
            message.react('❌');
        }
    },
};
