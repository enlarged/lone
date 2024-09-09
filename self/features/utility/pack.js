const fs = require('fs');
const bible = '/root/self/tools/txt/pack.txt';

module.exports = {
    configuration: {
        name: 'pack',
        description: 'Chat pack a user',
        aliases: ['p'],
        syntax: 'pack <user> (amount)',
        example: 'pack @transude 10',
        module: 'utility'
    },
    run: async (session, message, args) => {

        if (args.length < 1) {
            message.react('❌');
            return;
        }

        const user = message.mentions.users.first();
        if (!user) {
            message.react('❌');
            return;
        }

        let amount = 1;
        if (args.length > 1) {
            amount = parseInt(args[1]);
        }

        if (!amount || amount < 1 || amount > 100) {
            message.react('❌');
            return;
        }

        let packContent = '';
        try {
            message.delete();
            packContent = fs.readFileSync(bible, 'utf8');
        } catch (error) {
            session.log('ERROR ', error);
            return;
        }

        const packLines = packContent.split('\n').filter(line => line.trim().length > 0);

        for (let i = 0; i < amount; i++) {
            const randomLine = packLines[Math.floor(Math.random() * packLines.length)];
            await message.channel.send(`${user} ${randomLine}`);
        }
    }
}
