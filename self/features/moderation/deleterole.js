module.exports = {
    configuration: {
        name: 'deleterole',
        description: 'Delete a role',
        syntax: 'deleterole <role>',
        example: 'deleterole @role',
        aliases: ['delrole'],
        module: 'moderation'
    },
    run: async (session, message, args) => {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return session.warn(session, message, "You do not have the required permissions to delete a role");
        }

        const role = message.mentions.roles.first();
        if (!role) {
            return message.react('❌');
        }

        role.delete().then(() => {
            message.react('✅');
        }).catch((error) => {
            session.log('ERROR ', error);
            message.react('❌');
        }
        );
    }
};