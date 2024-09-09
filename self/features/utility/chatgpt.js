const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
    configuration: {
        name: 'gemini',
        aliases: ['gpt', 'ask', 'chatgpt'],
        description: 'Generate text with prompts',
        module: 'miscellaneous',
        syntax: 'gemini <prompt>',
        example: 'gemini What is the meaning of life?',
    },

    run: async (session, message, args) => {
        const genAI = new GoogleGenerativeAI('your_gemini_api_key');
        try {
            const prompt = args.join(' ');

            if (!prompt) {
                return message.react('❌');
            }

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return message.channel.send(`\`\`\`${text}\`\`\``)
        } catch (error) {
            session.log('Error generating text with Gemini:', error);
            message.react('❌');
        }
    }
};