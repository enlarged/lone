module.exports = {
    configuration: {
        name: 'ghost',
        aliases: ['gh'],
        description: 'Make all clients appear invisible',
        syntax: 'ghost',
        example: 'ghost',
        module: 'utility'
    },

    run: async (session, message, args) => {
        try {
            const allClients = [session, ...session.clients];

            const clientPromises = allClients.map(client => client.user.setStatus('invisible'));
            await Promise.all(clientPromises);

            message.channel.send('All clients are now invisible.');
        } catch (error) {
            console.error('Error setting clients to invisible:', error);
            message.channel.send('An error occurred while setting clients to invisible.');
        }
    }
};