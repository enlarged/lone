const fs = require('fs');
const db = '/root/self/tools/db/autoreact.json'

module.exports = {
    configuration: {
        name: 'autoreact',
        description: 'Toggle autoreact on or off.',
        aliases: ['ar'],
        syntax: 'autoreact',
        example: 'autoreact',
        module: 'utility'
    },
    run: async (session, message, args) => {

        try {
            const data = JSON.parse(fs.readFileSync(db, 'utf8'));
            data.autoreact = !data.autoreact;
            fs.writeFileSync(db, JSON.stringify(data, null, 4));
            await message.react('✅');
        } catch (error) {
            console.error('Error toggling autoreact:', error);
            message.channel.send('An error occurred while toggling autoreact.');
        }
    }
}