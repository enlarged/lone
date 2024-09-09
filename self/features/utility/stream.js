module.exports = {
    configuration: {
        name: 'stream',
        description: 'Set\'s the bot\'s stream status',
        syntax: 'stream <name>',
        example: 'stream Epic',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {
        const name = args.join(' ');
        if (!name) {
            return message.react('❌');
        }

        session.client.user.setActivity(name, { type: 'STREAMING', url: 'https://twitch.tv/ninja' });
        message.react('✅');
    }
}