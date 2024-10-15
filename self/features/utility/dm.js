module.exports = {
    configuration: {
        name: 'dm',
        description: 'Send a direct message to a user',
        syntax: 'dm <user> <message>',
        example: 'dm @user hello',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first();
        const content = args.slice(1).join(' ');

        if (!user || !content) {
            return session.command(module.exports, session, message);
        }

        user.send(content);
        message.react('✅');
    },
};