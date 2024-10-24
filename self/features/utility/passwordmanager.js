const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, '/root/self/tools/db/password.json');

module.exports = {
    configuration: {
        name: 'passwordmanager',
        aliases: ['pm', 'pw'],
        description: 'Manage passwords for different websites',
        syntax: 'password manager add <website> <username> <password>',
        example: 'password manager add discord.com c2rter password123',
        module: 'utility'
    },

    run: async (session, message, args) => {
        if (args.length < 4 || args[0].toLowerCase() !== 'add') {
            return session.command(module.exports, session, message);
        }

        const website = args[1];
        const username = args[2];
        const password = args[3];

        let passwordData = {};
        try {
            if (fs.existsSync(dbPath)) {
                passwordData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            }
        } catch (error) {
            session.log('ERROR ', error);
            return session.warn(session, message, 'An error occurred while reading the password database.');
        }

        if (!passwordData[website]) {
            passwordData[website] = [];
        }

        passwordData[website].push({ username, password });

        try {
            fs.writeFileSync(dbPath, JSON.stringify(passwordData, null, 4));
            session.grant(session, message, `Password saved for ${website}`);
        } catch (error) {
            session.log('ERROR ', error);
            return session.warn(session, message, 'An error occurred while writing to the password database.');
        }
    }
};