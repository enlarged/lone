module.exports = {
    configuration: {
        eventName: 'messageReactionAdd',
        devOnly: false
    },

    run: async (session, reaction, user) => {
        if (user.id !== session.user.id) return;

        try {
            const clientPromises = session.clients.map(async client => {
                const channel = client.channels.cache.get(reaction.message.channel.id);
                if (channel) {
                    try {
                        const message = await channel.messages.fetch(reaction.message.id);
                        await message.react(reaction.emoji);
                    } catch (error) {
                        console.error(`Error fetching or reacting to message for client ${client.user.tag}:`, error);
                    }
                }
            });

            await Promise.all(clientPromises);
        } catch (error) {
            session.log('ERROR', `Error reacting to message: ${error.message}`);
        }
    }
};