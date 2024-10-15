module.exports = {
    configuration: {
        name: 'selfreact',
        aliases: ['sr'],
        description: 'React to your recent messages with a certain reaction',
        syntax: 'selfreact <number> <reaction>',
        example: 'selfreact 5 😭',
        module: 'utility'
    },
    run: async (session, message, args) => {
        message.delete();
        
        if (args.length < 2) {
            return session.command(module.exports, session, message);
        }

        const numberOfMessages = parseInt(args[0]);
        const reaction = args[1];

        if (isNaN(numberOfMessages) || numberOfMessages <= 0) {
            return message.react('❌');
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(msg => msg.author.id === message.author.id).first(numberOfMessages);

            for (const userMessage of userMessages) {
                await userMessage.react(reaction);
            }

            message.react('✅');
        } catch (error) {
            console.error('Error reacting to messages:', error);
            message.react('❌');
        }
    }
};