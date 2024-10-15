module.exports = {
    configuration: {
        name: 'reverse',
        aliases: ['rv'],
        description: 'Reverse a string',
        syntax: 'reverse <string>',
        example: 'reverse hello',
        module: 'fun',
    },
    run: async (session, message, args) => {
        if (!args[0]) return message.react('❌');
        message.delete();
        return message.channel.send(args.join(' ').split('').reverse().join(''));
    }
}