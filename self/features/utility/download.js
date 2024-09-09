const axios = require('axios');
const { MessageAttachment } = require('discord.js-selfbot-v13');
const tiktok_regex = /(https?:\/\/.*?tiktok\.com[^$>\s]+)/g;

module.exports = {
    configuration: {
        name: 'download',
        description: 'Download a video TikTok',
        syntax: 'download <url>',
        example: 'download tiktok.com/@user/video/1234567890',
        aliases: ['dl'],
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (!args.length) {
            return message.react('❌');
        }

        const url = args[0];

        if (tiktok_regex.test(url)) {
            try {
                message.delete();
                const tiktokUrl = url.match(tiktok_regex)[0];
                const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`);
                const data = response.data.data;

                const videoAttachment = new MessageAttachment(data.play, 'lain_tiktok.mp4');
                await message.channel.send({ files: [videoAttachment] });
                session.log('REPOSTER', `TikTok video reposted by ${message.author.username} in ${message.guild.name} (${message.guild.id})`);
            } catch (error) {
                session.log('ERROR', error);
                message.react('❌');
            }
        } else {
            message.react('❌');
        }
    }
};