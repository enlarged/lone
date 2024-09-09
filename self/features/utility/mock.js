const fs = require('fs');
const db = '/root/self/tools/db/mock.json';

module.exports = {
    configuration: {
        name: 'mock',
        aliases: ['none'],
        description: 'Mock a user or stop mocking',
        syntax: 'mock <user|--stop>',
        example: 'mock @transude',
        module: 'utility',
    },
    run: async (session, message, args) => {
        if (args.includes('--stop')) {
            const data = JSON.parse(fs.readFileSync(db, 'utf8'));
            data.mock = null; 
            fs.writeFileSync(db, JSON.stringify(data, null, 4));
            await message.delete();
            return;
        }

        if (args.length < 1) {
            message.react('❌');
            return;
        }

        const user = message.mentions.users.first();
        if (!user) {
            message.react('❌');
            return;
        }

        const data = JSON.parse(fs.readFileSync(db, 'utf8'));
        data.mock = user.id;
        fs.writeFileSync(db, JSON.stringify(data, null, 4));
        await message.delete();
    },
};
