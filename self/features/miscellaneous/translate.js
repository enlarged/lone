const translate = require('@iamtraction/google-translate');

module.exports = {
    configuration: {
        name: 'translate',
        description: 'Translate a message',
        syntax: 'translate <language> <message>',
        example: 'translate en Hello',
        aliases: ['tr'],
        module: 'miscellaneous'
    },
    run: async (session, message, args) => {
        const language = args[0];
        const text = args.slice(1).join(' ');

        if (!language) return message.react('❌');
        if (!text) return message.react('❌');

        translate(text, { to: language }).then((res) => {
            message.delete();
            message.channel.send(res.text);
        }).catch((err) => {
            session.log('ERROR ', err);
            message.react('❌');
        });
    }
}