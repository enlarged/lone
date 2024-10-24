const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'tools', 'db', 'xray.json');

module.exports = {
    configuration: {
        name: 'xray',
        description: 'Relay messages from 1 server to another',
        aliases: ['xr'],
        syntax: 'xray <guild_id> <channel_id>',
        example: 'xray 1234567890 1234567890',
        module: 'utility'
    },

    run: async (session, message, args) => {
        if (!session.developers.includes(message.author.id)) return;

        if (args.length < 2) {
            return session.command(module.exports, session, message);
            return;
        }

        const guildId = args[0];
        const channelId = args[1];

        let xrayData = {};
        try {
            xrayData = JSON.parse(fs.readFileSync(db, 'utf8'));
        } catch (error) {
           session.log('ERROR ', error);
        }

        xrayData[guildId] = channelId;

        try {
            fs.writeFileSync(db, JSON.stringify(xrayData, null, 4));
            await message.react('✅');
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
};
