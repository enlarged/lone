const axios = require('axios');
const qs = require('qs');

module.exports = {
    configuration: {
        name: 'itunes',
        aliases: ['itu'],
        description: 'Finds a song from the iTunes API',
        syntax: 'itunes <query>',
        example: 'itunes Hardcore',
        module: 'miscellaneous'
    },

    run: async (session, message, args) => {
        try {
            if (!args[0]) {
                return session.command(module.exports, session, message);
            }

            const query = qs.stringify({
                term: args.join(' '),
                entity: 'song'
            });

            const response = await axios.get(`https://itunes.apple.com/search?${query}`);

            if (!response.data.results.length) {
                return message.react('❌');
            }

            message.delete();
            message.channel.send(response.data.results[0].trackViewUrl);
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
};
