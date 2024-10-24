const fs = require('fs');
const path = require('path');
const db = path.resolve(__dirname, 'tools', 'db', 'autoreact.json');

module.exports = {
    configuration: {
        name: 'autoreact',
        description: 'Automatically react to a user\'s messages with a specified emoji',
        aliases: ['ar'],
        syntax: 'autoreact <user> <emoji> [--stop]',
        example: 'autoreact @user 🎉',
        module: 'utility'
    },

    run: async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const user = message.mentions.users.first();
        const stopFlag = args.includes('--stop');

        if (stopFlag) {
            if (fs.existsSync(db)) {
                fs.writeFileSync(db, JSON.stringify({}, null, 4));
            }
            return session.grant(session, message, 'Stopped all autoreacts and cleared the database.');
        }

        if (!user) {
            return session.grant(session, message, 'User not found');
        }

        const userID = user.id;
        const emoji = args[1];

        if (!emoji) {
            return session.grant(session, message, 'Please provide an emoji to react with.');
        }

        let autoreactData = {};
        if (fs.existsSync(db)) {
            autoreactData = JSON.parse(fs.readFileSync(db, 'utf8'));
        }

        autoreactData[userID] = emoji;
        fs.writeFileSync(db, JSON.stringify(autoreactData, null, 4));

        session.grant(session, message, `Started autoreact for ${user.username} with emoji: "${emoji}"`);
    }
};