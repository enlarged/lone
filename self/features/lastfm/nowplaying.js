const fs = require('fs');
const db = '/root/self/tools/db/lastfm.json';
const axios = require('axios');

module.exports = {
    configuration: {
        name: 'nowplaying',
        description: 'View what you are currently playing',
        aliases: ['np', 'fm'],
        syntax: 'nowplaying',
        example: 'nowplaying',
        module: 'lastfm'
    },

    run: async (session, message, args) => {
        const userID = message.author.id;
        const lastfmData = JSON.parse(fs.readFileSync(db, 'utf8'));

        if (!lastfmData[userID]) {
            return session.warn(session, message, 'You don\'t have a last.fm username set');
        }

        try {
            const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmData[userID]}&api_key=${session.lastfm}&format=json`);
            const data = response.data;
            const recentTracks = data.recenttracks.track;

            if (!recentTracks || recentTracks.length === 0) {
                return session.warn(session, message, 'No recent tracks found.');
            }

            const nowPlaying = recentTracks[0];
            const trackName = nowPlaying.name;
            const artistName = nowPlaying.artist['#text'];
            const albumName = nowPlaying.album['#text'];
            const trackUrl = nowPlaying.url;

            const nowPlayingMessage = `Now Playing: **${trackName}** by **${artistName}**`;

            message.channel.send(nowPlayingMessage);
        } catch (error) {
            session.log('Error fetching recent tracks:', error);
            session.warn(session, message, 'Couldn\'t fetch recent tracks.');
        }
    }
};