module.exports = {
    configuration: {
        name: 'gname',
        aliases: [],
        description: 'Set the name of a guild',
        syntax: 'gname <name>',
        example: 'gname Hi',
        module: 'moderation',
    },
    run: async (session, message, args) => {
        const name = args.join(' ');

        if (!name) {
            return session.command(module.exports, session, message);
        }

        message.guild.setName(name);
        return session.grant(session, message, `Guild name set to ${name}`);
    },
};