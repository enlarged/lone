module.exports = {
    configuration: {
        name: 'unban',
        description: 'Unban a user from the server',
        syntax: 'unban <user> (reason)',
        example: 'unban @user spamming',
        aliases: [''],
        module: 'moderation'
    },
    run: async (session, message, args) => {

        const user = args[0];
        const reason = args.slice(1).join(' ');

        if (!user) {
            return session.command(module.exports, session, message);
        }

        const bannedUsers = await message.guild.bans.fetch();

        if (!bannedUsers.some(u => u.user.id === user)) {
            return message.react('❌');
        }

        const target = bannedUsers.find(u => u.user.id === user);

        await message.guild.members.unban(target.user, { reason });

        return session.grant(session, message, `User ${target.user.tag} has been unbanned`);
    }
}