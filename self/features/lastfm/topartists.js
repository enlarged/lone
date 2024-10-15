const fs = require('fs');
const axios = require('axios');
const db = '/root/self/tools/db/lastfm.json';

    module.exports = {
        configuration: {
            name: 'topartists',
            aliases: ['topar', 'ta'],
            description: 'View your top artists',
            syntax: 'topartists',
            example: 'topartists',
            module: 'lastfm'
        },
        run: async (session, message, args) => {
            const userID = message.author.id;
            const lastfmData = JSON.parse(fs.readFileSync(db, 'utf8'));
    
            if (!lastfmData[userID]) {
                return session.warn(session, message, 'You don\'t have a last.fm username set');
            }
    
            try {
                const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${lastfmData[userID]}&api_key=${session.lastfm}&format=json`);
                const data = response.data;
                const topArtists = data.topartists.artist;
    
                if (!topArtists || topArtists.length === 0) {
                    return session.warn(session, message, 'No top artists found.');
                }
    
                const pages = [];
                for (let i = 0; i < topArtists.length; i += 5) {
                    const artistsChunk = topArtists.slice(i, i + 5);
                    const pageContent = artistsChunk.map((artist, index) => `\`${i + index + 1}.\` **${artist.name}** - \`${artist.playcount}\` plays`).join('\n');
                    pages.push(`Top Artists for ${lastfmData[userID]}:\n\n${pageContent}`);
                }
    
                session.pagination(session, message, pages, pages.length, topArtists.length, `Top Artists for ${lastfmData[userID]}`, '<:lastfm:1210618435411775549>');
            } catch (error) {
                session.log('Error fetching top artists:', error);
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