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
            return message.react('❌');
        }

        message.guild.channels.create(name, {
            type: 'text',
        });
        message.react('✅');
    },
};