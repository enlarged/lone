const WolframAlpha = require('@dguttman/wolfram-alpha-api');

module.exports = {
    configuration: {
        name: 'wolfram',
        aliases: ['w'],
        description: 'Get math answers',
        syntax: 'wolfram <query>',
        example: 'wolfram 2+2',
        module: 'utility'
    },

    run: async (session, message, args) => {
        try {
            if (!args[0]) {
                return message.react('❌');
            }

            const wolframAlphaApi = new WolframAlpha('your_wolfram_key');
            const results = await wolframAlphaApi.getShort(args.join(' '));

            if (!results) {
                return message.react('❌');
            }

            return message.channel.send(`\`\`\`${results}\`\`\``);
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
};
