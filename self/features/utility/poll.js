module.exports = {
    configuration: {
        name: 'poll',
        description: 'Create a yes/no poll',
        syntax: 'poll <question>',
        example: 'poll ',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {

        const question = args.join(' ');
        if (!question) {
            return session.command(module.exports, session, message);
        }

        const poll = await message.channel.send(`**${question}**`);
        await poll.react('👍');
        await poll.react('👎');

    }
};