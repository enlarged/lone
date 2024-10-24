const fs = require('fs');
const path = require('path');
const db = path.resolve(__dirname, 'tools', 'db', 'autoreply.json');
const pack_txt = path.resolve(__dirname, 'tools', 'txt', 'pack.txt');

module.exports = {
    configuration: {
        name: 'autoreply',
        description: 'Automatically reply to a user\'s messages with a specified message or a random pack message',
        aliases: [''],
        syntax: 'autoreply <user> [message] [--stop]',
        example: 'autoreply @c2rter Hello there!',
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
            return session.grant(session, message, 'Stopped all autoreplies and cleared the database.');
        }

        if (!user) {
            return session.grant(session, message, 'User not found');
        }

        const userID = user.id;
        const replyMessage = args.slice(1).join(' ') || null;

        let autoreplyData = {};
        if (fs.existsSync(db)) {
            autoreplyData = JSON.parse(fs.readFileSync(db, 'utf8'));
        }

        if (replyMessage) {
            autoreplyData[userID] = replyMessage;
        } else {
            const packMessages = fs.readFileSync(pack_txt, 'utf8').split('\n').filter(Boolean);
            const randomMessage = packMessages[Math.floor(Math.random() * packMessages.length)];
            autoreplyData[userID] = randomMessage;
        }

        fs.writeFileSync(db, JSON.stringify(autoreplyData, null, 4));

        session.grant(session, message, `Started autoreply for ${user.username} with message: "${autoreplyData[userID]}"`);
    }
};