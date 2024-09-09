const axios = require('axios');

module.exports = {
    configuration: {
        name: 'image',
        description: 'Search Google for an image',
        aliases: ["img"],
        syntax: 'image <query>',
        example: 'image cats',
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (!args.length) return message.react('❌');
        
        try {
            const res = await axios(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDHcNBPqv-GpTR6_oyA6EnTyiRXeGUjokI&cx=b7498d486b2d19b97&q=${args.join(' ')}&searchType=image${message.channel.nsfw ? '' : '&safe=active'}&alt=json&start=1`);
            const images = res.data.items;

            if (!images || images.length === 0) {
                return message.react('❌');
            }

            const messages = images.slice(0, 10).map(image => (
                `**${image.title}**\n${image.link}`
            ));

            session.pagination(session, message, messages);
        } catch (error) {
            message.react('❌');
            session.log('ERROR ', error);
        }
    }
};