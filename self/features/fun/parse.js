module.exports = {
    configuration : {
        name : 'parse',
        description : 'Parse a message to be sent one letter at a time',
        aliases : [''],
        syntax : 'parse <message>',
        example : 'parse message',
        module : 'fun'
    },

    run : async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const msg = args.join(' ');

        for (let i = 0; i < msg.length; i++) {
            setTimeout(() => {
                message.channel.send(msg[i]);
            }, 1000 * i);
        }
    }
}