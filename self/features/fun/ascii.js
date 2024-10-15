const figlet = require('figlet');

module.exports = {
    configuration: {
        name: 'ascii',
        description: 'Generate ASCII art',
        syntax: 'ascii <text>',
        example: 'ascii Hello',
        aliases: ['a'],
        module: 'fun'
    },
    run: async (session, message, args) => {
        if (args.length < 1) {
            return message.react('❌');
        }

        const text = args.join(' ');

        figlet(text, (err, data) => {
            if (err) {
                console.error('Error generating ASCII art:', err);
                message.channel.send('An error occurred while generating ASCII art.');
                return;
            }

            message.channel.send(`\`\`\`${data}\`\`\``);
        });
    }
}