const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Client, Collection } = require('discord.js-selfbot-v13');
const config = require('./config.json');
const logging = require(path.join(__dirname, 'tools', 'logging.js'));

const session = new Client();
session.commands = new Collection();
session.aliases = new Collection();
session.clients = [];

session.developers = config.developers;
session.token = config.token;
session.prefix = config.prefix;
session.webhook = config.webhook;
session.log = logging.logger;

const loadEvents = (session, eventsDir) => {
    const eventFiles = fs.readdirSync(eventsDir);

    for (const file of eventFiles) {
        const filePath = path.join(eventsDir, file);
        const eventHandler = require(filePath);

        if (eventHandler.configuration && eventHandler.run) {
            session.on(eventHandler.configuration.eventName, (...args) => eventHandler.run(session, ...args));
        } else {
            session.log('ERROR', `Invalid event handler in ${file}`);
        }
    }

    session.log('INFO', 'All events registered');
};

const loadCommands = (session) => {
    const commandsDir = path.join(__dirname, 'features');
    const commandFolders = fs.readdirSync(commandsDir);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsDir, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(folderPath, file));
            if (command.configuration && typeof command.run === 'function') {
                session.commands.set(command.configuration.name, command);
                if (command.configuration.aliases) {
                    command.configuration.aliases.forEach(alias => session.aliases.set(alias, command.configuration.name));
                }
            }
        }
    }

    session.log('INFO', 'All commands loaded');
};

const init = async () => {
    loadEvents(session, path.join(__dirname, 'events'));
    loadCommands(session);

    session.on('ready', () => {
        session.log('INFO', `Logged in as ${session.user.tag}`);
    });

    session.on('error', (error) => {
        session.log('ERROR', `Error: ${error.message}`);
    });

    await session.login(session.token);
};

init().catch((error) => {
    session.log('ERROR', `Failed to initialize: ${error.message}`);
});
