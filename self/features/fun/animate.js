module.exports = {
    configuration: {
        name: 'animate',
        description: 'Animate a message to be sent one letter at a time',
        aliases: [''],
        syntax: 'animate <message>',
        example: 'animate message',
        module: 'fun'
    },

    run: async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const msg = args.join(' ');

        const sentMessage = await message.channel.send('.');

        for (let i = 0; i <= msg.length; i++) {
            setTimeout(() => {
                sentMessage.edit(msg.slice(0, i));
            }, 1000 * i);
        }
    }
};