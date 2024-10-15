module.exports = {
    configuration: {
        name: 'userinfo',
        description: 'Get information about a user',
        syntax: 'userinfo <user>',
        example: 'userinfo @user',
        aliases: ['ui'],
        module: 'information'
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const roles = member.roles.cache
            .filter(role => role.id !== message.guild.id) 
            .map(role => role.name)
            .join(', ') || 'No roles';

        const userInfo = [
            `**Username:** ${user.tag}`,
            `**User ID:** ${user.id}`,
            `**Joined Server On:** ${member.joinedAt.toDateString()}`,
            `**Account Created On:** ${user.createdAt.toDateString()}`,
            `**Roles:** ${roles}`
        ];

        message.channel.send(userInfo.join('\n'));
    },
};