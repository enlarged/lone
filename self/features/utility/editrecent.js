module.exports = {
    configuration: {
        name: 'editrecent',
        description: 'Edit the most recent message sent by the bot to the given content',
        syntax: 'editrecent <new content>',
        example: 'editrecent This is the new content',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (!args.length) {
            return message.channel.send('Please provide the new content for the message.');
        }

        const newContent = args.join(' ');

        try {
            const messages = await message.channel.messages.fetch({ limit: 100 });

            const botMessage = messages.find(msg => msg.author.id === session.user.id);

            if (!botMessage) {
                return message.channel.send('No recent message found from the bot.');
            }
            await botMessage.edit(newContent);
            message.channel.send('The most recent message has been edited.');
        } catch (error) {
            console.error('Error editing the recent message:', error);
            message.channel.send('An error occurred while editing the recent message.');
        }
    }
};