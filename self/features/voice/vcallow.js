const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'tools', 'db', 'voicereject.json');

module.exports = {
    configuration: {
        name: 'vcallow',
        aliases: ['va'],
        description: 'Allow a rejected user to join voice channels',
        syntax: 'vcallow <user>',
        example: 'vcallow @user',
        module: 'utility'
    },

    run: async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const user = message.mentions.users.first();
        if (!user) {
            return session.warn(session, message, 'You must mention a user to allow back into voice channels.');
        }

        let rejectData = {};
        try {
            if (fs.existsSync(db)) {
                rejectData = JSON.parse(fs.readFileSync(db, 'utf8'));
            }
        } catch (error) {
            console.error('Error reading voice reject database:', error);
            return session.warn(session, message, 'An error occurred while reading the voice reject data.');
        }

        if (!rejectData[user.id]) {
            return session.warn(session, message, `${user.username} is not currently rejected from voice channels.`);
        }

        delete rejectData[user.id];

        try {
            fs.writeFileSync(db, JSON.stringify(rejectData, null, 4));
            return session.grant(session, message, `Allowed ${user.username} to join your voice channels.`);
        } catch (error) {
            session.log('Error writing voice reject data:', error);
            return session.warn(session, message, 'An error occurred while writing the voice reject data.');
        }
    }
};
