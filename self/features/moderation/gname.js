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
            return message.react('❌');
        }

        message.guild.setName(name);
        message.react('✅');
    },
};