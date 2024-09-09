module.exports = {
    configuration: {
        name: 'help',
        aliases: ['cmds'],
        description: 'Displays a list of commands or information about a specific command.',
        module: 'information',
        syntax: '-help [command/module]',
        example: '-help clear',
    },
    run: async (session, message, args) => {
        const { commands } = session;

        if (!args.length) {
            const modules = commands.reduce((acc, command) => {
                const module = command.configuration.module || 'Uncategorized';
                acc[module] = acc[module] || [];
                acc[module].push(command.configuration.name);
                return acc;
            }, {});

            const moduleList = Object.entries(modules)
                .map(([module, cmds]) => `${module}\n${cmds.join(', ')}`)
                .join('\n\n');

            return message.channel.send(`\`\`\`\n${moduleList}\n\`\`\``);
        }

        const query = args[0].toLowerCase();
        const matchedCommand = commands.get(query) || commands.find(c => c.configuration.aliases.includes(query));
        const matchedModule = Object.entries(commands.reduce((acc, cmd) => {
            const module = cmd.configuration.module || 'Uncategorized';
            acc[module] = acc[module] || [];
            acc[module].push(cmd.configuration.name);
            return acc;
        }, {})).find(([module]) => module.toLowerCase() === query);

        if (matchedCommand) {
            const { name, description, aliases, syntax, example } = matchedCommand.configuration;
            const aliasesText = aliases.length ? aliases.join(', ') : 'None';
            return message.channel.send(`**Command: ${name}**\n\n${description}\n\`\`\`Syntax: ${syntax}\nExample: ${example}\`\`\``);
        }

        if (matchedModule) {
            const [module, cmds] = matchedModule;
            return message.channel.send(`\`\`\`\n${module}\n${cmds.join(', ')}\n\`\`\``);
        }

        return message.channel.send('That\'s not a valid command or module!');
    }
};
