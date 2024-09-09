const axios = require('axios');

module.exports = {
    configuration: {
        name: 'vanity',
        aliases: ['none'],
        description: 'Check if a vanity is available',
        syntax: 'vanity <vanity>',
        example: 'vanity okay',
        module: 'information'
    },
    run: async (session, message, args) => {
        const vanity = args[0];

        if (!vanity) {
            return session.command(module.exports, session, message);
        }

        try {
            const response = await axios.get(`https://discord.com/api/invite/${vanity}`);
            
            if (response.data.code) {
                return message.react('❌');
            } else {
                return message.react('✅');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return message.react('✅');
            } else {
                session.log('ERROR ', error);
                return message.react('❌');
            }
        }
    }
};
