const axios = require('axios');

module.exports = {
    configuration: {
        name: 'uwuify',
        aliases: ['uwu'],
        description: 'UwUify a message',
        syntax: 'uwuify <message>',
        example: 'uwuify Hello',
        module: 'fun'
    },

    run: async (session, message, args) => {
        if (!args[0]) {
            return message.react('❌');
        }

        const response = await axios.get(`https://nekos.life/api/v2/owoify?text=${args.join(' ')}`);

        message.delete();
        message.channel.send(response.data.owo);
    }
};