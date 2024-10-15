module.exports = {
    configuration: {
        name: 'avatar',
        description: 'Get the avatar of a user',
        syntax: 'avatar (user)',
        example: 'avatar @user',
        aliases: ['av'],
        module: 'information'
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first() || message.author;
        const avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

        message.channel.send({ content: `# ${user.tag}'s avatar`, files: [avatar] });
    }
}