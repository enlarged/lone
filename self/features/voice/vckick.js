module.exports = {
    configuration: {
        name: 'vckick',
        aliases: ['vk', 'disconnect', 'dc'],
        description: 'Kick a user from a voice channel',
        syntax: 'vckick <@user>',
        example: 'vckick @c2rter',
        module: 'voice',
    },

    run: async (session, message, args) => {
        const member = message.mentions.members.first();
        if (!member) {
            return session.command(module.exports, session, message);
        }

        if (!member.voice.channel) {
            return session.warn(session, message, 'The user is not in a voice channel.');
        }

        member.voice.kick();
        session.grant(session, message, `Kicked ${member.user.tag} from the voice channel.`);
    }
};
