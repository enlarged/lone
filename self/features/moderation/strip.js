module.exports = {
    configuration: {
        name: 'strip',
        aliases: [],
        description: 'Strip all roles from a member',
        syntax: 'strip <user>',
        example: 'strip @transude',
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const user = message.mentions.members.first();

        if (!user) {
            return session.command(module.exports, session, message);
        }

        try {
            await user.roles.set([]);
            return session.grant(session, message, `Roles stripped from ${user.user}`);
        } catch (error) {
            console.error('Error stripping roles:', error);
            message.react('❌');
        }
    }
};