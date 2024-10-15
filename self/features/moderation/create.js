module.exports = {
    configuration: {
        name: 'create',
        aliases: [],
        description: 'Create a text channel',
        syntax: 'create <name>',
        example: 'create hi text',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        const name = args.join(' ');

        if (!name) {
            return session.command(module.exports, session, message);
        }

        message.guild.channels.create(name, {
            type: 'text',
        });
        return session.grant(session, message, `Channel ${name} created`);
    },
};