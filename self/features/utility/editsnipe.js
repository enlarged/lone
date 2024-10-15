const moment = require('moment');

module.exports = {
    configuration: {
        name: 'editsnipe',
        description: 'View recently edited messages',
        aliases: ['es'],
        syntax: 'editsnipe',
        example: 'editsnipe',
        module: 'utility'
    },
    run: async (session, message, args) => {
        const editsnipes = session.editsnipes.get(message.channel.id);
        
        if (!editsnipes || editsnipes.length === 0) {
            return session.command(module.exports, session, message);
        }
        
        const latestEditsnipe = editsnipes[0];
    
        
        message.channel.send(`${latestEditsnipe.oldMessage.author.username} edited the message:\n\n${latestEditsnipe.oldMessage.content} to ${latestEditsnipe.newMessage.content}`);
    }
};
