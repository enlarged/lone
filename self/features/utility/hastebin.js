const axios = require('axios');

module.exports = {
    configuration: {
        name: "hastebin",
        description: "Upload content to Hastebin",
        syntax: "hastebin <content>",
        example: "hastebin Hello, World!",
        aliases: ["hb", "pastebin"],
        module: "utility"
    },
    run: async (session, message, args) => {
        if (!args[0]) return message.channel.send("You need to provide some text to upload!");

        try {
            const response = await axios.post("https://hastebin.skyra.pw/documents", args.join(" "), {
                headers: {
                    "Content-Type": "text/plain"
                }
            });

            const data = response.data;

            message.channel.send(`https://hastebin.skyra.pw/${data.key}`);
        } catch (error) {
            console.error('Error uploading to Hastebin:', error);
            message.channel.send('An error occurred while uploading to Hastebin.');
        }
    }
}