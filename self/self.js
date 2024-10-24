const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Client, Collection } = require('discord.js-selfbot-v13');
const config = require('./config.json');
const logging = require(path.join(__dirname, 'tools', 'logging.js'));

const session = new Client();
const autoreact_db = path.join(__dirname, 'tools', 'db', 'autoreact.json');
const xray_db = path.join(__dirname, 'tools', 'db', 'xray.json');
const mock_db = path.join(__dirname, 'tools', 'db', 'mock.json');
const autoreply_db = path.join(__dirname, 'tools', 'db', 'autoreply.json');
const pack_txt = path.join(__dirname, 'tools', 'txt', 'pack.txt');

session.developers = config.developers;
session.token = config.token;
session.lastfm = config.lastfm;
session.embed = config.embed;
session.webhook = config.webhook;
session.bot = config.bot;
session.prefix = config.prefix;
session.pagination = require(path.join(__dirname, 'tools', 'paginator.js'));
session.command = require(path.join(__dirname, 'tools', 'msg', 'command.js')).command;
session.grant = require(path.join(__dirname, 'tools', 'msg', 'approve.js')).grant;
session.warn = require(path.join(__dirname, 'tools', 'msg', 'warning.js')).warn;
session.log = logging.logger;
session.commands = new Collection();
session.aliases = new Collection();
session.clients = [];

const loadEvents = (session, eventsDir) => {
    let eventCount = 0;
    const eventFiles = fs.readdirSync(eventsDir);

    for (const file of eventFiles) {
        const filePath = path.join(eventsDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadEvents(session, filePath);
        } else if (file.endsWith('.js')) {
            try {
                const eventHandler = require(filePath);
                if (eventHandler.configuration && eventHandler.run) {
                    session.on(eventHandler.configuration.eventName, (...args) => eventHandler.run(session, ...args));
                    eventCount++;
                } else {
                    session.log('ERROR', `Invalid event handler file ${file}: Missing configuration or run function`);
                }
            } catch (error) {
                session.log('ERROR', `Error registering event in file ${file}: ${error.message}`);
            }
        }
    }

    if (eventCount > 0) {
        session.log('INFO', `Registered all ${eventCount} events`);
    }
};

const loadCommands = (session) => {
    let commandCount = 0;
    const commandsDir = path.join(__dirname, 'features');
    const commandFolders = fs.readdirSync(commandsDir);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                try {
                    const commandFile = require(path.join(folderPath, file));
                    if (commandFile.configuration && typeof commandFile.run === 'function') {
                        session.commands.set(commandFile.configuration.name, commandFile);
                        if (commandFile.configuration.aliases) {
                            commandFile.configuration.aliases.forEach(alias => session.aliases.set(alias, commandFile.configuration.name));
                        }
                        commandCount++;
                    } else {
                        session.log('ERROR', `Invalid command file ${file}: Missing configuration or run function`);
                    }
                } catch (error) {
                    session.log('ERROR', `Error registering command in file ${file}: ${error.message}`);
                }
            }
        }
    }

    if (commandCount > 0) {
        session.log('INFO', `Registered all ${commandCount} commands`);
    }
};

const loadTokensAndCreateClients = async (session) => {
    const tokensFilePath = path.join(__dirname, 'tools', 'txt', 'tokens.txt');
    const tokens = fs.readFileSync(tokensFilePath, 'utf8').split('\n').filter(Boolean);

    for (const token of tokens) {
        const client = new Client();

        client.on('ready', () => {
            session.log('INFO', `Connected as ${client.user.username} (${client.user.id})`);
            client.user.setStatus('online');
            client.user.setActivity('', { type: 'STREAMING', url: 'https://www.twitch.tv/ninja' });
        });

        client.on('error', (error) => {
            session.log('ERROR', `An error occurred with token ${token}: ${error.message}`);
        });

        client.on('messageReactionAdd', async (reaction, user) => {
            if (session.developers.includes(user.id)) {
                try {
                    await reaction.message.react(reaction.emoji);
                } catch (error) {
                    console.error('Error reacting to message:', error);
                }
            }
        });

        try {
            await client.login(token);
            session.clients.push(client);
        } catch (error) {
            session.log('ERROR', `Failed to login with token ${token}: ${error.message}`);
        }
    }
};

const setupSession = (session) => {
    session.on('ready', () => {
        session.log('INFO', `Connected as ${session.user.username} (${session.user.id})`);
    });

    session.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        try {
            const data = JSON.parse(fs.readFileSync(autoreact_db, 'utf8'));
            const userID = message.author.id;

            if (data[userID]) {
                const emoji = data[userID];
                try {
                    await message.react(emoji);
                } catch (error) {
                    console.error(`Error reacting to message from ${message.author.username}:`, error);
                }
            }
        } catch (error) {
            console.error('Error reading autoreact database:', error);
        }

        if (!message.content.startsWith(session.prefix)) return;

        const args = message.content.slice(session.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!session.developers.includes(message.author.id)) {
            return;
        }

        const command = session.commands.get(commandName) || session.commands.get(session.aliases.get(commandName));

        if (!command) return;

        try {
            command.run(session, message, args);
        } catch (error) {
            session.log('ERROR', `An error occurred while running command ${commandName}: ${error.message}`);
        }
    });

    loadEvents(session, path.join(__dirname, 'events'));
    loadCommands(session);
    loadTokensAndCreateClients(session);
};

setupSession(session);

session.login(config.token).catch(error => {
    session.log('ERROR', `Failed to login: ${error.message}`);
});
