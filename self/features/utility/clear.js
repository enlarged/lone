module.exports = {
    configuration: {
        name: 'clear',
        aliases: ['me'],
        description: 'Clears 20 of my recent messages',
        syntax: 'clear',
        example: 'clear',
        module: 'utility',
    },

    run: async (session, message, args) => {

        const channel = message.channel;
        try {
            const messages = await channel.messages.fetch({ limit: 20 });


            const botMessages = messages.filter(msg => msg.author.id === session.user.id);

            for (const [id, msg] of botMessages) {
                await msg.delete();
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            session.log('ERROR', `An error occurred while clearing messages: ${error.message}`);
            message.react('❌');
        }
    }
}
