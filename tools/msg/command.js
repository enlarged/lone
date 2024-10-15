const fs = require('fs');

function command(command, session, message) {
    try {
        if (!command || !session || !message) {
            console.error('Invalid arguments provided to command function:', { command, session, message });
            message.channel.send('An error occurred while processing the command.')
                .then(sentMessage => {
                    setTimeout(() => {
                        sentMessage.delete().catch(console.error);
                    }, 6000);
                })
                .catch(console.error);
            return message.delete().catch(console.error);
        }

        if (message.guild && !message.guild.id) {
            console.error('Guild ID is undefined:', message.guild);
            message.channel.send('An error occurred while processing the command.')
                .then(sentMessage => {
                    setTimeout(() => {
                        sentMessage.delete().catch(console.error);
                    }, 6000);
                })
                .catch(console.error);
            return message.delete().catch(console.error);
        }

        if (!session.color || !session.prefix) {
            console.error('Session properties are undefined:', session);
            message.channel.send('An error occurred while processing the command.')
                .then(sentMessage => {
                    setTimeout(() => {
                        sentMessage.delete().catch(console.error);
                    }, 6000);
                })
                .catch(console.error);
            return message.delete().catch(console.error);
        }

        if (!command.configuration || typeof command.configuration !== 'object') {
            console.error('Command configuration is missing or not an object:', command.configuration);
            message.channel.send('An error occurred while processing the command.')
                .then(sentMessage => {
                    setTimeout(() => {
                        sentMessage.delete().catch(console.error);
                    }, 6000);
                })
                .catch(console.error);
            return message.delete().catch(console.error);
        }

        const { name, syntax, aliases, description, example } = command.configuration;

        if (!name || !syntax || !aliases || !description) {
            console.error('Command configuration is incomplete:', command.configuration);
            message.channel.send('An error occurred while processing the command.')
                .then(sentMessage => {
                    setTimeout(() => {
                        sentMessage.delete().catch(console.error);
                    }, 6000);
                })
                .catch(console.error);
            return message.delete().catch(console.error);
        }

        message.channel.send({ content: `\`\`\`ini\n[ Command: ${name} ]\n\`\`\`\`\`\`asciidoc\n> ${description}\nSyntax: ${syntax}\nExample: ${example}\`\`\`` })
            .then(sentMessage => {
                setTimeout(() => {
                    sentMessage.delete().catch(console.error);
                }, 6000);
            })
            .catch(console.error);
        return message.delete().catch(console.error);
    } catch (error) {
        console.error('Error executing command function:', error);
        console.error('Command:', command);
        console.error('Session:', session);
        console.error('Message:', message);
        message.channel.send('An error occurred while processing the command.')
            .then(sentMessage => {
                setTimeout(() => {
                    sentMessage.delete().catch(console.error);
                }, 6000);
            })
            .catch(console.error);
        return message.delete().catch(console.error);
    }
}

module.exports = {
    command
};