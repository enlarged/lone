module.exports = {
    configuration: {
        name: 'deafen',
        aliases: ['deaf'],
        description: 'Deafen a user in a voice channel',
        syntax: 'deafen <@user>',
        example: 'deafen @c2rter',
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

        member.voice.setDeaf(true);
        session.grant(session, message, `Deafened ${member.user.tag}.`);
    },
};