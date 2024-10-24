const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const axios = require('axios');

module.exports = {
    configuration: {
        name: 'zip',
        aliases: [''],
        description: 'Download all emojis and send in zip',
        syntax: 'zip',
        example: 'zip',
        module: 'utility'
    },
    run: async (session, message, args) => {

        const emojis = message.guild.emojis.cache.map(emoji => {
            if (emoji.url) {
                return { url: emoji.url, name: emoji.name };
            } else {
                return { url: emoji.identifier, name: emoji.name };
            }
        });
        const zip = archiver('zip', { zlib: { level: 9 } });
        const outputFilePath = path.join(__dirname, '..', '..', 'emojis.zip');
        const output = fs.createWriteStream(outputFilePath);

        zip.pipe(output);

        try {
            for (const emoji of emojis) {
                const filename = emoji.name + path.extname(emoji.url);
                const response = await axios.get(emoji.url, { responseType: 'arraybuffer' });
                zip.append(response.data, { name: filename });
            }

            zip.finalize();

            output.on('close', () => {
                message.channel.send({
                    files: [{
                        attachment: outputFilePath,
                        name: 'emojis.zip'
                    }]
                }).then(() => {
                    fs.unlink(outputFilePath, (err) => {
                        if (err) {
                            session.log('Error deleting zip file:', err);
                        }
                    });
                });
            });

            output.on('error', (err) => {
                session.log('Error creating zip file:', err);
            });
        } catch (error) {
            session.log('Error fetching emojis:', error);
        }
    }
};