const axios = require('axios');

module.exports = {
    configuration: {
        name: 'iplookup',
        description: 'Lookup an IP address',
        syntax: 'iplookup <ip>',
        example: 'iplookup',
        aliases: [''],
        module: 'information'
    },

    run: async (session, message, args) => {
        const ip = args.join(' ');
        try {
            const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
            const { query, country, regionName, city, zip, lat, lon, timezone, isp, org, as } = data;

            message.channel.send({ content: `IP: ${query}\nCountry: ${country}\nRegion: ${regionName}\nCity: ${city}\nZip: ${zip}\nLat: ${lat}\nLon: ${lon}\nTimezone: ${timezone}\nISP: ${isp}\nOrg: ${org}\nAS: ${as}` });
        } catch (error) {
            console.error('Error fetching IP data:', error);
            message.channel.send('An error occurred while looking up the IP address.');
        }
    }
};