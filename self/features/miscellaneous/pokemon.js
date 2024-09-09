const axios = require('axios');

module.exports = {
    configuration: {
        name: 'pokemon',
        description: 'Get information about a Pokémon',
        syntax: 'pokemon <name>',
        example: 'pokemon pikachu',
        aliases: ['pkmn'],
        module: 'miscellaneous'
    },
    run: async (session, message, args) => {
        const pokemon = args.join(' ').toLowerCase();
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const { sprites } = data;

        message.channel.send({ content: `${sprites.front_default}` });
    }
};