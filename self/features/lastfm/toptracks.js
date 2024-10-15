const fs = require('fs');
const axios = require('axios');
const db = '/root/self/tools/db/lastfm.json';

module.exports = {
    configuration: {
        name: 'toptracks',
        aliases: ['topt', 'tt'],
        description: 'View your top tracks',
        syntax: 'toptracks',
        example: 'toptracks',
        module: 'lastfm'
    },
    run: async (session, message, args) => {
        const userID = message.author.id;
        const lastfmData = JSON.parse(fs.readFileSync(db, 'utf8'));

        if (!lastfmData[userID]) {
            return session.warn(session, message, 'You don\'t have a last.fm username set');
        }

        try {
            const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${lastfmData[userID]}&api_key=${session.lastfm}&format=json`);
            const data = response.data;
            const topTracks = data.toptracks.track;

            if (!topTracks || topTracks.length === 0) {
                return session.warn(session, message, 'No top tracks found.');
            }

            const pages = [];
            for (let i = 0; i < topTracks.length; i += 5) {
                const tracksChunk = topTracks.slice(i, i + 5);
                const pageContent = tracksChunk.map((track, index) => `\`${i + index + 1}.\` **${track.artist.name} - ${track.name}** - \`${track.playcount}\` plays`).join('\n');
                pages.push(`Top Tracks for ${lastfmData[userID]}:\n\n${pageContent}`);
            }

            session.pagination(session, message, pages, pages.length, topTracks.length, `Top Tracks for ${lastfmData[userID]}`, '<:lastfm:1210618435411775549>');
        } catch (error) {
            session.log('Error fetching top tracks:', error);
            session.warn(session, message, error.message);
        }
    }
};

function chunkArray(array, chunkSize) {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArr.push(array.slice(i, i + chunkSize));
    }
    return chunkedArr;
}