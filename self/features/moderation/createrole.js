module.exports = {
    configuration: {
        name: 'createrole',
        description: 'Create a role',
        syntax: 'createrole <name> (color)',
        example: 'createrole Boss #000001',
        aliases: [],
        module: 'moderation'
    },
    run: async (session, message, args) => {

        const roleName = args[0];
        const roleColor = args[1];

        if (!roleName) {
            return session.command(module.exports, session, message);
        }

        try {
            const role = await message.guild.roles.create({
                data: {
                    name: roleName,
                    color: roleColor || 'DEFAULT'
                }
            });

            return session.grant(session, message, `Role ${role.name} created`);
        } catch (error) {
            console.error('Error creating role:', error);
            message.react('❌');
    }
}
};