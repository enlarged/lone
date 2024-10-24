const axios = require('axios');
const { MessageAttachment } = require('discord.js-selfbot-v13');

const facebook_regex = /(https?:\/\/(?:www\.)?facebook\.com\/[-a-zA-Z0-9@:%._\+~#=\/]+)/g;
const instagram_regex = /(https?:\/\/(?:www\.)?instagram\.com\/[-a-zA-Z0-9@:%._\+~#=\/]+)/g;
const tiktok_regex = /(https?:\/\/.*?tiktok\.com[^$>\s]+)/g;

module.exports = {
    configuration: {
        name: 'download',
        description: 'Download a video from Facebook, Instagram, or TikTok',
        syntax: 'download <url>',
        example: 'download tiktok.com/@user/video/1234567890',
        aliases: ['dl'],
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (!args.length) {
            return session.command(module.exports, session, message);
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
        } else if (facebook_regex.test(url)) {
            try {
                message.delete();
                const facebookUrls = url.match(facebook_regex);

                if (facebookUrls) {
                    for (const facebookUrl of facebookUrls) {
                        const options = {
                            method: 'GET',
                            url: 'https://fb-video-reels.p.rapidapi.com/smvd/get/all',
                            params: { url: facebookUrl },
                            headers: {
                                'x-rapidapi-key': '141e070f61mshebb9f8f7dac8e8fp179694jsnb651b7323525',
                                'x-rapidapi-host': 'fb-video-reels.p.rapidapi.com'
                            }
                        };

                        const response = await axios.request(options);
                        const data = response.data;

                        const videoLink = data.links.find(link => link.quality === 'video_sd_0')?.link;

                        if (videoLink) {
                            const filename = 'lain_facebook.mp4';
                            const attachment = new MessageAttachment(videoLink, filename);

                            await message.channel.send({ files: [attachment] });
                            session.log('REPOSTER', `Facebook video reposted by ${message.author.username} in ${message.guild.name} (${message.guild.id})`);
                        } else {
                            session.log('ERROR', 'No video link found');
                            message.react('❌');
                        }
                    }
                }
            } catch (error) {
                session.log('ERROR', error);
                message.react('❌');
            }
        } else if (instagram_regex.test(url)) {
            try {
                message.delete();
                const instagramUrls = url.match(instagram_regex);

                for (const instagramUrl of instagramUrls) {
                    const response = await axios.get('https://instagram-post-downloader.p.rapidapi.com/', {
                        params: { url: instagramUrl },
                        headers: {
                            'X-RapidAPI-Key': '141e070f61mshebb9f8f7dac8e8fp179694jsnb651b7323525',
                            'X-RapidAPI-Host': 'instagram-post-downloader.p.rapidapi.com'
                        }
                    });

                    const downloadUrl = response.data.data[0].download;
                    const thumbnailUrl = response.data.data[0].thumbnail;
                    let filename = 'lain_instagram';
                    let fileExtension = downloadUrl ? '.mp4' : '.png';

                    const urlToSend = downloadUrl || thumbnailUrl;
                    const attachment = new MessageAttachment(urlToSend, `${filename}${fileExtension}`);
                    await message.channel.send({ files: [attachment] });
                }
            } catch (error) {
                session.log('ERROR', error)
                message.react('❌');
            }
        } else {
            message.react('❌');
        }
    }
};