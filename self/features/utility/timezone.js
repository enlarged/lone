const axios = require('axios');
const qs = require('qs');
const moment = require('moment-timezone');
const geo = require('geo-tz');

module.exports = {
    configuration: {
        name: 'timezone',
        aliases: ['tz'],
        description: 'View a location\'s timezone',
        syntax: 'timezone <city>',
        example: 'timezone Chicago',
        module: 'utility'
    },

    run: async (session, message, args) => {
        try {
            const query = args.join(' ');

            if (!query) {
                return message.react('❌');
            }

            const queryString = qs.stringify({
                q: query,
                limit: 1,
                appid: '985f10d327f3695fa10aab134e0b6391'
            });

            const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?${queryString}`);

            const results = response.data;

            if (!results || results.length === 0) {
                return message.react('❌');
            }

            const location = geo.find(results[0].lat, results[0].lon)[0];
            const time = moment.tz(new Date(), location).format('hh:mm A');

            return message.channel.send(`The timezone for ${results[0].name} is ${location} and the current time is ${time}`)
        } catch (error) {
            session.log('ERROR  ', error);
            return message.react('❌');
        }
    }
};
