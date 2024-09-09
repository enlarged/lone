module.exports = {
    configuration: {
        name: 'ban',
        description: 'Ban a user',
        syntax: 'ban <user> (reason)',
        example: 'ban @user',
        aliases: ['none'],
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.react('❌');
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
            message.react('✅');
        } catch (error) {
            console.error('Error banning member:', error);
            message.react('❌');
        }
    }
}