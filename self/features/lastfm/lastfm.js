const fs = require('fs');
const db = '/root/self/tools/db/lastfm.json';

module.exports = {
    configuration : {
        name : 'lastfm',
        description : 'Set your Last.fm username',
        aliases : ['lfm'],
        syntax : 'lastfm <username>',
        example : 'lastfm username',
        module : 'lastfm'
    },

    run : async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const username = args[0];

        let lastfmData = {};
        try {
            lastfmData = JSON.parse(fs.readFileSync(db, 'utf8'));
        } catch (error) {
            session.log('ERROR ', error);
        }

        lastfmData[message.author.id] = username;

        try {
            fs.writeFileSync(db, JSON.stringify(lastfmData, null, 4));
            await message.react('✅');
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
}