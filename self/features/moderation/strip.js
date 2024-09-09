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
            return message.react('❌');
        }

        try {
            await user.roles.set([]);
            message.react('✅');
        } catch (error) {
            console.error('Error stripping roles:', error);
            message.react('❌');
        }
    }
};