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
            clientId: '90595927739c497889bb248dd3aa422d',
            clientSecret: '5f3629f827b74218af14627dac0daed7'
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