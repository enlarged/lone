module.exports = {
    configuration: {
        name: 'messages',
        aliases: [''],
        description: 'Find recent messages from a specified user in a specified server',
        syntax: 'messages <serverID> <userID>',
        example: 'messages 123456789012345678 987654321098765432',
        module: 'utility'
    },

    run: async (session, message, args) => {
        if (args.length < 2) {
            return message.channel.send('Please provide a server ID and a user ID.');
        }

        const serverID = args[0];
        const userID = args[1];

        const messagesInfo = await Promise.all(session.clients.map(async client => {
            const guild = client.guilds.cache.get(serverID);
            if (!guild) {
                return `Client: ${client.user.username}\nNot in the specified server.`;
            }

            const channels = guild.channels.cache.filter(channel => channel.isText());
            const userMessages = [];

            for (const channel of channels.values()) {
                const messages = await channel.messages.fetch({ limit: 100 }).catch(() => []);
                const userMsgs = messages.filter(msg => msg.author.id === userID);
                userMessages.push(...userMsgs.map(msg => `${msg.createdAt.toISOString()} - ${msg.content}`));
            }

            if (userMessages.length > 0) {
                return `Client: ${client.user.username}\nRecent Messages:\n${userMessages.join('\n')}`;
            } else {
                return `Client: ${client.user.username}\nNo recent messages from the specified user.`;
            }
        }));

        const botGuild = session.guilds.cache.get(serverID);
        if (!botGuild) {
            messagesInfo.push(`Bot: ${session.user.username}\nNot in the specified server.`);
        } else {
            const botChannels = botGuild.channels.cache.filter(channel => channel.isText());
            const botUserMessages = [];

            for (const channel of botChannels.values()) {
                const messages = await channel.messages.fetch({ limit: 100 }).catch(() => []);
                const userMsgs = messages.filter(msg => msg.author.id === userID);
                botUserMessages.push(...userMsgs.map(msg => `${msg.createdAt.toISOString()} - ${msg.content}`));
            }

            if (botUserMessages.length > 0) {
                messagesInfo.push(`Bot: ${session.user.username}\nRecent Messages:\n${botUserMessages.join('\n')}`);
            } else {
                messagesInfo.push(`Bot: ${session.user.username}\nNo recent messages from the specified user.`);
            }
        }

        await message.channel.send(`\`\`\`\n${messagesInfo.join('\n\n')}\n\`\`\``);
    }
};