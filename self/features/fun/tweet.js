const axios = require('axios');
const { MessageAttachment } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');

module.exports = {
    configuration: {
        name: 'tweet',
        aliases: ['tw'],
        description: 'Tweet something',
        syntax: 'tweet <message>',
        example: 'tweet I am super cool',
        module: 'fun',
    },
    run: async (session, message, args) => {
        if (!args.length) {
            return message.react('❌');
        }

        const text = args.join(' ');
        const url = `https://nekobot.xyz/api/imagegen?type=tweet&username=${encodeURIComponent(message.author.username)}&text=${encodeURIComponent(text)}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.success) {
                const imageUrl = response.data.message;

                const imageResponse = await axios({
                    url: imageUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                const imagePath = path.join(__dirname, 'tweet.png');
                const writer = fs.createWriteStream(imagePath);

                imageResponse.data.pipe(writer);

                writer.on('finish', async () => {
                    const attachment = new MessageAttachment(imagePath);
                    await message.channel.send({ files: [attachment] });
                    fs.unlinkSync(imagePath);
                });

                writer.on('error', async () => {
                    await message.react('❌');
                });
            } else {
                await message.react('❌');
            }
        } catch (error) {
            session.log('ERROR ', error);
            await message.react('❌');
        }
    }
};
