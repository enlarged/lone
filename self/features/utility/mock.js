const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'tools', 'db', 'mock.json');

module.exports = {
    configuration: {
        name: 'mock',
        aliases: [''],
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
            return session.command(module.exports, session, message);
            return;
        }

        const user = message.mentions.users.first();
        if (!user) {
            return session.command(module.exports, session, message);
            return;
        }

        const data = JSON.parse(fs.readFileSync(db, 'utf8'));
        data.mock = user.id;
        fs.writeFileSync(db, JSON.stringify(data, null, 4));
        await message.delete();
    },
};
