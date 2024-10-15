module.exports = {
    configuration: {
        name: 'coinflip',
        description: 'Flip a coin',
        aliases: [''],
        syntax: 'coinflip',
        example: 'coinflip',
        module: 'fun'
    },

    run: async (session, message, args) => {
        const coin = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';

        message.channel.send(`The coin landed on ${coin}`);
    }
};