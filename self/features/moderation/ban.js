module.exports = {
    configuration: {
        name: 'ban',
        description: 'Ban a user',
        syntax: 'ban <user> (reason)',
        example: 'ban @user',
        aliases: [''],
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return session.command(module.exports, session, message);
        }

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ');

        if (!member) {
            return message.react('❌');
        }

        if (!member.bannable) {
            return message.react('❌');
        }

        try {
            await member.ban({ reason: reason || 'No reason provided' });
            return session.grant(session, message, `User ${user} has banned`);
        } catch (error) {
            console.error('Error banning member:', error);
            message.react('❌');
        }
    }
}