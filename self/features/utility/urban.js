const axios = require('axios');

module.exports = {
    configuration: {
        name: 'urban',
        description: 'Get the definition of a word from Urban Dictionary',
        syntax: 'urban <word>',
        example: 'urban yeet',
        aliases: ['ud'],
        module: 'utility'
    },

    run: async (session, message, args) => {
        try {
            if (!args[0]) {
                return message.react('❌');
            }

            const query = args.join(' ');

            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${query}`);

            if (!response.data.list.length) {
                return message.react('❌');
            }

            const data = response.data.list[0];

            message.channel.send(`**${data.word}**\n\n${data.definition}\n\n*Example:*\n${data.example}`);
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
};