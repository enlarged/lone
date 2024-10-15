module.exports = {
    configuration: {
        name: 'serverinfo',
        description: 'Get information about the current server',
        syntax: 'serverinfo',
        example: 'serverinfo',
        aliases: ['si'],
        module: 'information'
    },
    run: async (session, message, args) => {
        const guild = message.guild;
        const owner = await guild.fetchOwner();

        const serverInfo = [
            `**Server Name:** ${guild.name}`,
            `**Owner:** ${owner.user.tag}`,
            `**Members:** ${guild.memberCount}`,
            `**Roles:** ${guild.roles.cache.size}`,
            `**Channels:** ${guild.channels.cache.size}`,
            `**Created On:** ${guild.createdAt.toDateString()}`
        ];

        message.channel.send(serverInfo.join('\n'));
    },
};