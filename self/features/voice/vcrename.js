module.exports = {
    configuration: {
        name: 'vcrename',
        aliases: ['vcr'],
        description: 'Rename a your current voice channel',
        module: 'voice',
    },
    run: async (session, message, args) => {
        const channel = message.member.voice.channel;
        if (!channel) {
            return session.warn(session, message, 'You must be in a voice channel to use this command.');
        }

        const name = args.join(' ');
        if (!name) {
            return session.command(module.exports, session, message);
        }

        channel.setName(name);
        session.grant(session, message, `Voice channel name set to ${name}`);
    },
};