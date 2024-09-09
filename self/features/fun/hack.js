module.exports = {
    configuration: {
        name: 'hack',
        aliases: ['none'],
        description: 'Hack someone',
        syntax: 'hack <member>',
        example: 'hack @c2rter',
        module: 'fun',
    },
    run: async (session, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.react('❌');
        }

        if (user.id === message.author.id) {
            return message.react('❌');
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        try {
            const prompt = await message.channel.send(`Hacking ${user.username} now...`);

            await wait(2700);
            await prompt.edit('Finding Discord login...');
            await wait(2700);
            await prompt.edit(`Found:\n**Email**: \`${user.username}***@gmail.com\`\n**Password**: \`*******\``);
            await wait(3700);
            await prompt.edit('Fetching DMs...');
            await wait(3700);
            await prompt.edit('Listing most common words...');
            await wait(2700);
            await prompt.edit(`Injecting virus into discriminator #${user.discriminator}`);
            await wait(3700);
            await prompt.edit('Virus injected');
            await wait(3700);
            await prompt.edit('Finding IP address...');
            await wait(5000);
            await prompt.edit('Spamming email...');
            await wait(6700);
            await prompt.edit('Selling data to Facebook...');
            await wait(3700);

            await prompt.delete();
            await message.channel.send('Lol get hacked noob');
        } catch (error) {
            console.error('Error during hack command execution:', error);
            message.react('❌');
        }
    }
};