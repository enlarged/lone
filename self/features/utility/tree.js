const fs = require('fs');
const path = require('path');

module.exports = {
    configuration: {
        name: 'tree',
        description: 'Generate a tree structure of all commands and send it as an HTML file',
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

        // Build the HTML content
        let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Command List</title>
            <style>
                body {
                    background-color: black;
                    color: white;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                .category {
                    margin-bottom: 30px;
                }
                .category-title {
                    font-size: 24px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid white;
                    padding-bottom: 5px;
                }
                .command {
                    margin-left: 20px;
                    font-size: 18px;
                    margin-bottom: 5px;
                }
                .syntax {
                    font-size: 14px;
                    color: #8b949e;
                    margin-left: 30px;
                }
            </style>
        </head>
        <body>
        `;

        // Add each category and its commands
        for (const [category, cmds] of Object.entries(categories)) {
            htmlContent += `<div class="category">`;
            htmlContent += `<div class="category-title">${category}</div>`;
            for (const cmd of cmds) {
                htmlContent += `
                    <div class="command">
                        ${cmd.name} - <span>${cmd.description}</span>
                    </div>
                    <div class="syntax">Syntax: ${cmd.syntax}</div>`;
            }
            htmlContent += `</div>`;
        }

        htmlContent += `
        </body>
        </html>`;

        // Write the HTML content to a file
        const filePath = path.resolve(__dirname, 'command_list.html');
        fs.writeFileSync(filePath, htmlContent, 'utf8');

        // Send the HTML file
        await message.channel.send({
            files: [{
                attachment: filePath,
                name: 'command_list.html'
            }]
        });

        // Optionally, delete the file after sending
        fs.unlinkSync(filePath);
    }
};
