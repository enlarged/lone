const axios = require('axios');

module.exports = {
    configuration: {
        name: 'soundcloud',
        description: 'Search SoundCloud for song results',
        syntax: 'soundcloud <query>',
        example: 'soundcloud Hardcore',
        aliases: ['sc'],
        module: 'miscellaneous'
    },
    run: async (session, message, args, prefix) => {
        message.delete();
        try {
            if (!args[0]) {
                return session.command(module.exports, session, message);
            }

            const response = await axios.get(`https://api-v2.soundcloud.com/search/tracks?q=${args.join(' ')}`, {
                headers: {
                    'Authorization': 'OAuth 2-292593-994587358-Af8VbLnc6zIplJ'
                }
            });
            const results = response.data;

            if (!results.collection.length) {
                return message.react('❌');
            }

            message.channel.send(`${results.collection[0].permalink_url}`);

            if (!args[0]) {
                return session.command(module.exports, session, message);
            }
        } catch (error) {
            session.log('Error searching SoundCloud:', error);
            message.react('❌');
        }
    }
};
