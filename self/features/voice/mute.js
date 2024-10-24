module.exports = {
    configuration: {
        name: 'mute',
        aliases: ['silence', 'shutup'],
        description: 'Mute a user in a voice channel',
        syntax: 'mute <@user>',
        example: 'mute @c2rter',
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

        member.voice.setMute(true);
        session.grant(session, message, `Muted ${member.user.tag}.`);
    }
};