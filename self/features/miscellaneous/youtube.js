const yts = require('yt-search');

module.exports = {
    configuration: {
        name: 'youtube',
        description: 'Search YouTube for video results',
        syntax: 'youtube <query>',
        example: 'youtube Hardcore',
        aliases: ['yt'],
        module: 'miscellaneous'
    },
    run: async (session, message, args) => {
        message.delete();
        try {
            if (!args[0]) {
                return message.react('❌');
            }

            const response = await yts(args.join(' '));
            const results = response.videos;

            if (!results.length) {
                return message.react('❌');
            }

            message.channel.send(`${results[0].url}`);

            if (!args[0]) {
                return session.command(module.exports, session, message);
            }
        } catch (error) {
            session.log('Error searching YouTube:', error);
            message.react('❌');
        }
    }
};