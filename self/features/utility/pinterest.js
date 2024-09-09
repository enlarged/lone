const { MessageAttachment } = require('discord.js-selfbot-v13');
const axios = require('axios');

module.exports = {
    configuration: {
        name: "pinterest",
        aliases: ['pins'],
        description: "Fetch pins from a Pinterest user",
        syntax: "pinterest <username>",
        example: "pinterest hygric",
        module: 'utility',
    },
    run: async (session, message, args) => {
        const username = args[0];

        if (!username) {
            return message.react('❌');
        }

        try {
            const pins = await fetchPins(username);
            if (pins.length === 0) {
                return message.react('❌');
            }

            const thread = await message.channel.threads.create({
                name: `@${username}`,
                autoArchiveDuration: 60,
                reason: 'Fetching Pinterest pins',
            });

            let attachments = [];
            let i = 0;
            for (const pin of pins) {
                if (i >= 10) {
                    await thread.send({ files: attachments });
                    attachments = [];
                    i = 0;
                }
                const attachment = new MessageAttachment(pin.image);
                attachments.push(attachment);
                i++;
            }

            if (attachments.length > 0) {
                await thread.send({ files: attachments });
            }
        } catch (error) {
            session.log('Error fetching pins:', error);
            return message.react('❌');
        }
    }
};

async function fetchPins(username) {
    try {
        const pinsUrl = `https://api.pinterest.com/v3/pidgets/users/${username}/pins/`;
        const response = await axios.get(pinsUrl);
        const pins = response.data.data.pins.map(pin => ({
            description: pin.description || 'Pin',
            url: `https://www.pinterest.com${pin.link}`,
            image: pin.images['564x'].url
        }));
        return pins;
    } catch (error) {
        console.error('Error fetching pins from Pinterest API:', error);
        throw error;
    }
}
