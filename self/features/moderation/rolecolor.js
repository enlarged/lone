module.exports = {
    configuration: {
        name: 'rolecolor',
        description: 'Change the color of a role',
        aliases: [''],
        syntax: 'rolecolor <role> <color>',
        example: 'rolecolor Admin #ff0000',
        module: 'moderation'
    },

    run: async (session, message, args) => {
        if (args.length < 2) {
            return session.command(module.exports, session, message);
        }

        const role = findRole(message, args[0]);

        if (!role) {
            return session.message('Role not found', message);
        }

        const color = args[1];

        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            return session.message('Invalid color format', message);
        }

        await role.setColor(color);

        session.message(`Role color changed to ${color}`, message);
    }
};

function findRole(message, roleName) {
    const roleMention = message.mentions.roles.first();
    if (roleMention) {
        return roleMention;
    }

    return message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
}