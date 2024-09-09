module.exports = {
    configuration: {
        name: 'unban',
        description: 'Unban a user from the server',
        syntax: 'unban <user> (reason)',
        example: 'unban @user spamming',
        aliases: ['none'],
        module: 'moderation'
    },
    run: async (session, message, args) => {

        const user = args[0];
        const reason = args.slice(1).join(' ');

        if (!user) {
            return message.react('❌');
        }

        const bannedUsers = await message.guild.bans.fetch();

        if (!bannedUsers.some(u => u.user.id === user)) {
            return message.react('❌');
        }

        const target = bannedUsers.find(u => u.user.id === user);

        await message.guild.members.unban(target.user, { reason });

        message.react('✅');
    }
}