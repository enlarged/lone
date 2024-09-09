const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Client, Collection } = require('discord.js-selfbot-v13');
const config = require('./config.json');
const logging = require('./tools/logging.js');

const session = new Client();
const db = './tools/db/autoreact.json';
const xray_db = './tools/db/xray.json';
const mock_db = './tools/db/mock.json';

session.developers = config.developers;
session.token = config.token;
session.webhook = config.webhook;
session.bot = config.bot;
session.prefix = config.prefix;
session.pagination = require('./tools/paginator.js');
session.log = logging.logger;
session.commands = new Collection();
session.aliases = new Collection();

session.on('ready', () => {
    session.log('INFO', `Connected as ${session.user.username} (${session.user.id})`);
});

session.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    let autoreactEnabled = false;
    try {
        const data = JSON.parse(fs.readFileSync(db, 'utf8'));
        autoreactEnabled = data.autoreact;
    } catch (error) {
        console.error('Error reading autoreact status:', error);
    }

    if (autoreactEnabled && session.developers.includes(message.author.id)) {
        try {
            await message.react('☠️');
        } catch (error) {
            console.error('Error reacting to message:', error);
        }
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

session.on('messageCreate', async (message) => {
    try {
        const data = JSON.parse(fs.readFileSync(mock_db, 'utf8'));
        if (message.author.id === data.mock) {
            message.channel.send(message.content);
        }
    } catch (error) {
        console.error('Error mocking user:', error);
    }
});

session.on('messageCreate', async (message) => {
    if (message.author?.bot || !message.guild) return;

    let xrayData = {};

    try {
        xrayData = JSON.parse(fs.readFileSync(xray_db, 'utf8'));
    } catch (error) {
        console.error('Error reading xray database:', error);
        return;
    }

    const channelId = xrayData[message.guild.id];
    if (!channelId) return;

    const data = {
        username: `${message.author.username} @${message.guild.name} (#${message.channel.name})`,
        avatar_url: message.author.displayAvatarURL(),
        content: message.content || ''
    };

    if (message.attachments.size > 0) {
        const attachments = message.attachments.map(att => ({ attachment: att.url }));
        data.files = attachments;
    }

    try {
        await axios.post(session.webhook, data);
    } catch (error) {
        console.error('Error relaying message:', error);
    }
});

session.on('error', (error) => {
    session.log('ERROR', `An error occurred: ${error.message}`);
});

session.login(config.token).catch(error => {
    session.log('ERROR', `Failed to login: ${error.message}`);
});

function loadEvents(session, eventsDir) {
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
}

const eventsDir = './events';
loadEvents(session, eventsDir);

function loadCommands(session) {
    let commandCount = 0;
    const commandsDir = './features';
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
}

loadCommands(session);
