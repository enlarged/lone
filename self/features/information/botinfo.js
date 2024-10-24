module.exports = {
    configuration: {
        name: 'botinfo',
        aliases: ['bi', 'about'],
        description: 'Get information about the bot',
        syntax: 'information',
        example: 'information',
        module: 'features',
    },
    run: async (session, message, args) => {
        message.channel.send(`\`\`\`Commands: ${session.commands.size}\nChannels: ${session.channels.cache.size}\nGuilds: ${session.guilds.cache.size}\nUsers: ${session.users.cache.size}\`\`\``);
    }
};