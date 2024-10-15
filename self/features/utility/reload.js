const fs = require('fs');
const path = require('path');

module.exports = {
    configuration: {
        name: 'reload',
        description: 'Reloads all commands.',
        aliases: ['rl'],
        syntax: 'reload',
        example: 'reload',
        module: 'utility'
    },
    run: async (session, message, args) => {

        try {
            reloadCommands(session);
            await message.react('✅');
        } catch (error) {
            session.log('ERROR ', error);
            message.react('❌');
        }
    }
};

function reloadCommands(session) {
    const commandsDir = '/root/self/features';
    const commandFolders = fs.readdirSync(commandsDir);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                delete require.cache[require.resolve(path.join(folderPath, file))];
                const commandFile = require(path.join(folderPath, file));
                if (commandFile.configuration && commandFile.configuration.name) {
                    session.commands.set(commandFile.configuration.name, commandFile);

                    if (commandFile.configuration.aliases && Array.isArray(commandFile.configuration.aliases)) {
                        commandFile.configuration.aliases.forEach(alias => {
                            session.aliases.set(alias, commandFile.configuration.name);
                        });
                    }
                }
            }
        }
    }
}
