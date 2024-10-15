module.exports = {
    configuration: {
        name: 'kick',
        description: 'Kick a user',
        syntax: 'kick <user> (reason)',
        example: 'kick @user',
        aliases: [''],
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first();
        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ');

        if (!user) {
            return session.command(module.exports, session, message);
        }

        if (!member) {
            return message.react('❌');
        }

        if (!member.kickable) {
            return message.react('❌');
        }

        member.kick({ reason: reason || 'No reason provided' });

        return session.grant(session, message, `User ${user} has been kicked`);
    }
}