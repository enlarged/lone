module.exports = {
    configuration: {
        name: 'evaluate',
        description: 'Evaluate JavaScript code',
        syntax: 'evaluate <code>',
        example: 'evaluate 1 + 1',
        aliases: ['eval'],
        module: 'utility'
    },
    run: async (session, message, args) => {
        const code = args.join(' ');
        if (!code) {
            return session.command(module.exports, session, message);
        }

        try {
            const result = eval(code);
            message.channel.send(`\`\`\`js\n${result}\`\`\``);
        } catch (error) {
            console.error('Error evaluating code:', error);
            message.react('❌');
        }
    }
};