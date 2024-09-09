const axios = require('axios');
const url = 'https://meme-api.com/gimme'

module.exports = {
    configuration: {
        name: 'meme',
        aliases: ['memes'],
        description: 'Get a random meme from Reddit',
        syntax: 'meme',
        example: 'meme',
        module: 'fun'
    },

    run: async (session, message, args) => {
        try {
            const { data } = await axios.get(url);

            message.delete();
            return message.channel.send({ content: `${data.url}` });
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
}