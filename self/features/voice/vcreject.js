
const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'tools', 'db', 'voicereject.json');

module.exports = {
    configuration: {
        name: 'vcreject',
        aliases: ['vr'],
        description: 'Reject a user from joining voice channels',
        syntax: 'vcreject <user>',
        example: 'vcreject @user',
        module: 'utility'
    },

    run: async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const user = message.mentions.users.first();
        if (!user) {
            return session.warn(session, message, 'You must mention a user to reject from joining your voice channels)');
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

        rejectData[user.id] = true;

        try {
            fs.writeFileSync(db, JSON.stringify(rejectData, null, 4));
            return session.grant(session, message, `Rejected ${user.username} from joining your voice channels.`);
        } catch (error) {
            session.log('Error writing voice reject data:', error);
            return session.warn(session, message, 'An error occurred while writing the voice reject data.');
        }
    }
};