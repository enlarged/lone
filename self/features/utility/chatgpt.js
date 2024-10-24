const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
    configuration: {
        name: 'chatgpt',
        aliases: ['gpt', 'ask', 'gemini'],
        description: 'Generate text with prompts',
        module: 'miscellaneous',
        syntax: 'gemini <prompt>',
        example: 'gemini What is the meaning of life?',
    },

    run: async (session, message, args) => {
        const genAI = new GoogleGenerativeAI('AIzaSyALxTacFT2vbMHegUNWEJWgJ599pOyrYo8');
        try {
            const prompt = args.join(' ');

            if (!prompt) {
                return session.command(module.exports, session, message);
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