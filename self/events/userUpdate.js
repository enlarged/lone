const fs = require('fs');
const path = require('path');
const filePath = path.resolve('tools', 'db', 'namehistory.json');

module.exports = {
    configuration: {
        eventName: 'userUpdate',
        devOnly: false
    },
    run: async (session, oldUser, newUser) => {
        if (oldUser.username !== newUser.username) {
            let nameHistory = {};
            if (fs.existsSync(filePath)) {
                nameHistory = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }

            const userId = newUser.id;

            if (!nameHistory[userId]) {
                nameHistory[userId] = [];
            }

            if (!nameHistory[userId].includes(newUser.username)) {
                nameHistory[userId].push(newUser.username);
            }

            fs.writeFile(filePath, JSON.stringify(nameHistory, null, 2), (err) => {
                if (err) {
                    session.log('ERROR', err);
                }
            });
        }

        for (const client of session.clients) {
            if (oldUser.username !== newUser.username) {
                let nameHistory = {};
                if (fs.existsSync(filePath)) {
                    nameHistory = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                }

                const userId = newUser.id;

                if (!nameHistory[userId]) {
                    nameHistory[userId] = [];
                }

                if (!nameHistory[userId].includes(newUser.username)) {
                    nameHistory[userId].push(newUser.username);
                }

                fs.writeFile(filePath, JSON.stringify(nameHistory, null, 2), (err) => {
                    if (err) {
                        session.log('ERROR', err);
                    }
                });
            }
        }
    }
};