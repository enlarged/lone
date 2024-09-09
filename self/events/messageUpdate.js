module.exports = {
    configuration: {
        eventName: 'messageUpdate',
        devOnly: false
    },
    run: async (session, oldMessage, newMessage) => {
        if (!newMessage.content) return;

        if (!session.editsnipes) {
            session.editsnipes = new Map();
        }

        let editsnipes = session.editsnipes.get(newMessage.channel.id) || [];
        if (editsnipes.length > 20) editsnipes = editsnipes.slice(0, 19);

        editsnipes.unshift({
            oldMessage: oldMessage,
            newMessage: newMessage
        });

        session.editsnipes.set(newMessage.channel.id, editsnipes);

        if (newMessage.content.startsWith(session.prefix)) {
            const args = newMessage.content.slice(session.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = session.commands.get(commandName) || session.commands.get(session.aliases.get(commandName));
            if (!command) return;

            command.run(session, newMessage, args);
            session.log("INFO ", `${newMessage.author.username} used the command '${command.configuration.name}' in ${newMessage.guild ? newMessage.guild.name : 'DMs'} (${newMessage.guild ? newMessage.guild.id : 'N/A'})`)
        }
    }
};
