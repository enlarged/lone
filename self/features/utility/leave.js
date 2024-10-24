module.exports = {
    configuration: {
        name: 'leave',
        description: 'Make all clients and the bot leave the server',
        syntax: 'leave',
        example: 'leave',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (!message.guild) {
            return message.channel.send('This command can only be used in a server.');
        }

        try {
            await message.guild.leave();
            console.log(`Bot has left the server: ${message.guild.name}`);
        } catch (error) {
            console.error(`Error leaving the server with the main bot: ${error.message}`);
            message.channel.send('An error occurred while trying to leave the server with the main bot.');
        }

        for (const client of session.clients) {
            const guild = client.guilds.cache.get(message.guild.id);
            if (guild) {
                try {
                    await guild.leave();
                    console.log(`Client ${client.user.username} has left the server: ${message.guild.name}`);
                } catch (error) {
                    console.error(`Error leaving the server with client ${client.user.username}: ${error.message}`);
                    message.channel.send(`An error occurred while trying to leave the server with client ${client.user.username}.`);
                }
            }
        }
    }
};