module.exports = {
    configuration: {
        name: 'unghost',
        aliases: ['ugh'],
        description: 'Make all clients appear with the streaming status',
        syntax: 'unghost',
        example: 'unghost',
        module: 'utility'
    },

    run: async (session, message, args) => {
        try {
            const allClients = [session, ...session.clients];

            const clientPromises = allClients.map(client => {
                return client.user.setPresence({
                    status: 'online',
                    activities: [{
                        name: 'discord.gg/okay',
                        type: 'STREAMING',
                        url: 'https://www.twitch.tv/ninja'
                    }]
                });
            });
            await Promise.all(clientPromises);

            message.channel.send('All clients are now appearing with the streaming status.');
        } catch (error) {
            console.error('Error setting clients to streaming status:', error);
            message.channel.send('An error occurred while setting clients to streaming status.');
        }
    }
};