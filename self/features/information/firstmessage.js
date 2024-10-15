module.exports = {
    configuration: {
        name: 'firstmessage',
        aliases: ['firstmsg'],
        description: 'Get a link for the first message in a channel',
        syntax: 'firstmessage',
        example: 'firstmessage',
        module: 'information'
    },
    run: async (session, message, args) => {
        
        const channel = message.channel.id;

        const fetchMessages = await message.channel.messages.fetch({
            after: 1,
            limit: 1,
        });
        const firstmessage = fetchMessages.first();

        return message.channel.send(`[click here to view the first message in #${message.channel.name}](https://discord.com/channels/${message.guild.id}/${channel}/${firstmessage.id})`)
    }
};
