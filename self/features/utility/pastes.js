const fs = require('fs');
const path = require('path');
const dbPath = '/root/self/tools/db/hastebins.json';

module.exports = {
    configuration: {
        name: "pastes",
        description: "Retrieve a Hastebin link by name",
        syntax: "pastes <name>",
        example: "pastes test",
        aliases: ["paste", "getpaste"],
        module: "utility"
    },
    run: async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const name = args[0];

        try {
            if (!fs.existsSync(dbPath)) {
                return session.warn(session, message, 'No pastes found.');
            }

            const hastebinData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

            if (hastebinData[name]) {
                message.channel.send(hastebinData[name]);
            } else {
                session.warn(session, message, 'No paste found with that name.');
            }
        } catch (error) {
            session.log('ERROR ', error);
            session.error(session, message, 'An error occurred while retrieving the Hastebin link.');
        }
    }
};