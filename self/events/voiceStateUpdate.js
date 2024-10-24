const fs = require('fs');
const path = require('path');
const db = path.resolve(__dirname, 'tools', 'db', 'voicereject.json');

module.exports = {
    configuration: {
        eventName: 'voiceStateUpdate',
        devOnly: false
    },

    run: async (session, oldState, newState) => {
        if (!oldState.channelId && newState.channelId) {
            const userId = newState.id;

            let rejectData = {};
            try {
                if (fs.existsSync(db)) {
                    rejectData = JSON.parse(fs.readFileSync(db, 'utf8'));
                }
            } catch (error) {
                session.log('ERROR ', 'Error reading voice reject database:', error);
                return;
            }

            if (rejectData[userId]) {
                const botMember = newState.guild.members.cache.get(session.user.id);

                if (botMember && botMember.voice.channelId === newState.channelId) {
                    try {
                        await newState.disconnect();
                    } catch (error) {
                        session.log('ERROR ', `Error kicking user ${userId} from the voice channel:`, error);
                    }
                }
            }
        }
    }
};