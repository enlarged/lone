const SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
    configuration: {
        name: 'spotify',
        aliases: ['sp'],
        description: 'Search spotify for a song',
        syntax: 'spotify <query>',
        example: 'spotify Hardcore',
        module: 'miscellaneous'
    },

    run: async (session, message, args) => {

        const SpotifyClient = new SpotifyWebApi({
            clientId: 'your_spotify_clientId',
            clientSecret: 'your_spotify_clientSecret'
        });

        try {
            const query = args.join(' ');

            if (!query) {
                return session.command(module.exports, session, message);
            }

            const credentials = await SpotifyClient.clientCredentialsGrant();
            SpotifyClient.setAccessToken(credentials.body['access_token']);

            const { body: { tracks } } = await SpotifyClient.searchTracks(query);

            if (!tracks || tracks.items.length === 0) {
                return message.react('❌');
            }

            const track = tracks.items[0];

            message.delete();
            message.channel.send(track.external_urls.spotify);
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
};
