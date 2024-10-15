module.exports = {
    configuration: {
        name: 'string',
        description: 'Generate a random string',
        syntax: 'string <character amount>',
        example: 'string 20',
        aliases: [''],
        module: 'fun'
    },
    run: async (session, message, args) => {

        const amount = parseInt(args[0]);

        if (!amount || amount < 1) {
            return message.react('❌');
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < amount; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));

            if (i === amount - 1) {
                return message.channel.send(result);

            }

        }
    }
}