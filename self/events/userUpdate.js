const fs = require('fs');
const filePath = '/root/self/tools/db/names.json';

module.exports = {
    configuration: {
        eventName: 'userUpdate',
        devOnly: false
    },
    run: async (session, oldUser, newUser) => {
        if (oldUser.username !== newUser.username) {
            let nameHistory = {};
            if (fs.existsSync(filePath)) {
                nameHistory = require(filePath);
            }

            const userId = newUser.id;

            if (!nameHistory[userId]) {
                nameHistory[userId] = [];
            }
            nameHistory[userId].push(newUser.username);

            fs.writeFile(filePath, JSON.stringify(nameHistory, null, 2), (err) => {
                if (err) {
                    session.log('ERROR ', err);
                }
            });
        }
    }
};
