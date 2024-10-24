const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, 'tools', 'db', 'hastebin.json');

module.exports = {
    configuration: {
        name: "hastebin",
        description: "Upload content to Hastebin",
        syntax: "hastebin <content> --name <name>",
        example: "hastebin Hello, World! --name greeting",
        aliases: ["hb", "pastebin"],
        module: "utility"
    },
    run: async (session, message, args) => {
        const nameIndex = args.indexOf('--name');
        if (nameIndex === -1 || nameIndex === args.length - 1) {
            return session.command(module.exports, session, message);
        }

        const content = args.slice(0, nameIndex).join(' ');
        const name = args[nameIndex + 1];

        if (!content) {
            return session.command(module.exports, session, message);
        }

        try {
            const response = await axios.post("https://hastebin.skyra.pw/documents", content, {
                headers: {
                    "Content-Type": "text/plain"
                }
            });

            const data = response.data;
            const link = `https://hastebin.skyra.pw/${data.key}`;

            let hastebinData = {};
            if (fs.existsSync(dbPath)) {
                hastebinData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            }
            hastebinData[name] = link;
            fs.writeFileSync(dbPath, JSON.stringify(hastebinData, null, 4));

            message.channel.send(link);
        } catch (error) {
            console.error('Error uploading to Hastebin:', error);
            message.channel.send('An error occurred while uploading to Hastebin.');
        }
    }
};