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

        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        if (!args.length) {
            return message.channel.send('https://lone.rocks/commands.txt');
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
            const aliasesText = aliases.length ? aliases.join(', ') : '';
            return message.channel.send(`**Command: ${name}**\n\n${description}\n\`\`\`Syntax: ${syntax}\nExample: ${example}\`\`\``);
        }

        if (matchedModule) {
            const [module, cmds] = matchedModule;
            return message.channel.send(`\`\`\`\n${capitalizeFirstLetter(module)}\n${cmds.join(', ')}\n\`\`\``);
        }

        return message.channel.send('That\'s not a valid command or module!');
    }
};