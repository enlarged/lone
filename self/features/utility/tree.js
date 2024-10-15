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
        const commands = session.commands; // Assuming session.commands contains all commands
        const categories = {};

        // Organize commands by module (category)
        for (const command of commands.values()) {
            const module = command.configuration.module || 'Uncategorized';
            if (!categories[module]) {
                categories[module] = [];
            }
            categories[module].push(command.configuration);
        }

        // Build the tree structure
        let treeMessage = '';
        for (const [category, cmds] of Object.entries(categories)) {
            treeMessage += `├── ${category}\n`;
            for (const cmd of cmds) {
                treeMessage += `│    ├── ${cmd.name}[${cmd.aliases.join('|')}]: ${cmd.description}\n`;
            }
        }

        // Write the tree structure to a text file
        const filePath = path.resolve(__dirname, 'command_tree.txt');
        fs.writeFileSync(filePath, treeMessage, 'utf8');

        // Send the text file
        await message.channel.send({
            files: [{
                attachment: filePath,
                name: 'command_tree.txt'
            }]
        });

        // Optionally, delete the file after sending
        fs.unlinkSync(filePath);
    }
};