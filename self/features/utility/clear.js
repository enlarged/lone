const fs = require('fs');
const path = require('path');

module.exports = {
    configuration: {
        name: 'tree',
        description: 'Generate a tree structure of all commands and send it as a text file',
        syntax: 'tree',
        example: 'tree',
        aliases: [],
        module: 'utility'
    },
    run: async (session, message, args) => {
        const commands = session.commands;
        const categories = {};

        for (const command of commands.values()) {
            const module = command.configuration.module || 'Uncategorized';
            if (!categories[module]) {
                categories[module] = [];
            }
            categories[module].push(command.configuration);
        }

        let treeMessage = '';
        for (const [category, cmds] of Object.entries(categories)) {
            treeMessage += `├── ${category}\n`;
            for (const cmd of cmds) {
                const aliases = cmd.aliases.length > 0 ? `[${cmd.aliases.join('|')}]` : '';
                treeMessage += `│    ├── ${cmd.name}${aliases}: ${cmd.description}\n`;
            }
        }

        const filePath = path.resolve(__dirname, 'command_tree.txt');
        fs.writeFileSync(filePath, treeMessage, 'utf8');

        await message.channel.send({
            files: [{
                attachment: filePath,
                name: 'command_tree.txt'
            }]
        });

        fs.unlinkSync(filePath);
    }
};