module.exports = {
    configuration: {
        name: 'addrole',
        aliases: ['ar'],
        description: 'Add a role to a user',
        syntax: 'addrole <user> <role>',
        example: 'addrole @user RoleName',
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const user = message.mentions.members.first();
        const roleNameOrId = args.slice(1).join(' ');

        if (!user || !roleNameOrId) {
            return message.react('❌');
        }

        const role = message.guild.roles.cache.find(
            r => r.name.toLowerCase() === roleNameOrId.toLowerCase() || r.id === roleNameOrId
        );

        if (!role) {
            return message.react('❌');
        }

        try {
            await user.roles.add(role);
            message.react('✅');
        } catch (error) {
            console.error('Error adding role:', error);
            message.react('❌');
        }
    }
};