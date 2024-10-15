const fs = require('fs');
const axios = require('axios');
const db = '/root/self/tools/db/lastfm.json';

module.exports = {
    configuration: {
        name: 'recent',
        aliases: [''],
        description: 'Shows your most recent tracks',
        syntax: 'recent',
        example: 'recent',
        module: 'lastfm'
    },

    run: async (session, message, args) => {
        let targetUser = message.mentions.members.first() || message.member;
        const userID = targetUser.id;
        const lastfmData = JSON.parse(fs.readFileSync(db, 'utf8'));

        const lastfmUsername = lastfmData[userID];

        if (!lastfmUsername) {
            return session.warn(session, message, 'You don\'t have a last.fm username set');
        }

        try {
            const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmUsername}&api_key=${session.lastfm}&format=json&limit=20`);
            const recentTracks = data.recenttracks.track;

            if (!recentTracks || recentTracks.length === 0) {
                return session.warn(session, message, 'You haven\'t listened to any tracks recently');
            }

            const pages = [];
            for (let i = 0; i < recentTracks.length; i += 5) {
                const tracksChunk = recentTracks.slice(i, i + 5);
                const pageContent = tracksChunk.map((track, index) => `\`${i + index + 1}.\` **[${track.name}](${track.url})** by **${track.artist['#text']}**`).join('\n');
                pages.push(`Recent Tracks for ${lastfmUsername}:\n${pageContent}`);
            }

            session.pagination(session, message, pages, pages.length, recentTracks.length, `Recent Tracks for ${lastfmUsername}`, '<:lastfm:1210618435411775549>');
            
        } catch (error) {
            session.log('Error sending request to Last.FM:', error);
            session.warn(session, message, 'Couldn\'t fetch recent tracks');
        }
    }
};