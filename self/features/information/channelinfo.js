module.exports = {
    configuration: {
        name: 'channelinfo',
        description: 'Get information about the current channel',
        syntax: 'channelinfo',
        example: 'channelinfo',
        aliases: ['ci'],
        module: 'information'
    },
    run: async (session, message, args) => {
        const channel = message.channel;
        const channelInfo = [
            `**Channel Name:** ${channel.name}`,
            `**Channel ID:** ${channel.id}`,
            `**Channel Type:** ${channel.type}`,
            `**Creation Date:** ${channel.createdAt.toDateString()}`,
        ];

        if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS') {
            channelInfo.push(`**Topic:** ${channel.topic || 'No topic set'}`);
        }

        if (channel.type === 'GUILD_VOICE') {
            channelInfo.push(`**User Limit:** ${channel.userLimit || 'No limit'}`);
            channelInfo.push(`**Bitrate:** ${channel.bitrate} kbps`);
            channelInfo.push(`**Members Connected:** ${channel.members.size}`);
        }

        message.channel.send({ content: channelInfo.join('\n') });
    },
};