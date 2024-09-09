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
            return message.react('❌');
        }

        try {
            const role = await message.guild.roles.create({
                data: {
                    name: roleName,
                    color: roleColor || 'DEFAULT'
                }
            });

            message.react('✅');
        } catch (error) {
            console.error('Error creating role:', error);
            message.react('❌');
    }
}
};