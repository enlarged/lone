const fs = require('fs');
const path = require('path');
const bible = path.resolve(__dirname, 'tools', 'txt', 'pack.txt');

module.exports = {
    configuration: {
        name: 'pack',
        description: 'Chat pack a user',
        aliases: ['p'],
        syntax: 'pack <number> (user) [--clients]',
        example: 'pack 10 @transude --clients',
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (args.length < 2) {
            return session.command(module.exports, session, message);
        }

        let amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100) {
            return session.command(module.exports, session, message);
        }

        const user = message.mentions.users.first();
        if (!user) {
            return session.command(module.exports, session, message);
        }

        const useClients = args.includes('--clients');

        let packContent = '';
        try {
            message.delete();
            packContent = fs.readFileSync(bible, 'utf8');
        } catch (error) {
            session.log('ERROR ', error);
            return;
        }

        const packLines = packContent.split('\n').filter(line => line.trim().length > 0);

        const sendMessages = async (client, channelId) => {
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                const promises = [];
                for (let i = 0; i < amount; i++) {
                    const randomLine = packLines[Math.floor(Math.random() * packLines.length)];
                    promises.push(channel.send(`${user} ${randomLine}`));
                }
                await Promise.all(promises);
            }
        };

        if (useClients) {
            const clientPromises = session.clients.map(client => {
                const guild = client.guilds.cache.get(message.guild.id);
                if (guild) {
                    return sendMessages(client, message.channel.id);
                }
            });

            await Promise.all(clientPromises);
        } else {
            await sendMessages(session, message.channel.id);
        }
    }
};