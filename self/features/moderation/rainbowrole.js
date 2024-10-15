const activeIntervals = new Map();

module.exports = {
    configuration: {
        name: 'rainbowrole',
        description: 'Create a rainbow role',
        aliases: [''],
        syntax: 'rainbowrole <role> [--stop]',
        example: 'rainbowrole @role',
        module: 'moderation'
    },

    run: async (session, message, args) => {
        if (args.length < 1) {
            return session.command(module.exports, session, message);
        }

        const role = message.mentions.roles.first();
        const stopFlag = args.includes('--stop');

        if (!role) {
            return session.command(module.exports, session, message);
        }

        if (stopFlag) {
            if (activeIntervals.has(role.id)) {
                clearInterval(activeIntervals.get(role.id));
                activeIntervals.delete(role.id);
                return message.channel.send(`Stopped rainbow effect for role ${role.name}`);
            } else {
                return message.channel.send(`Rainbow effect is not active for role ${role.name}`);
            }
        }

        const colors = [
            'FF0000', 'FF1100', 'FF2200', 'FF3300', 'FF4400', 'FF5500', 'FF6600', 'FF7700', 'FF8800', 'FF9900',
            'FFAA00', 'FFBB00', 'FFCC00', 'FFDD00', 'FFEE00', 'FFFF00', 'EEFF00', 'DDFF00', 'CCFF00', 'BBFF00',
            'AAFF00', '99FF00', '88FF00', '77FF00', '66FF00', '55FF00', '44FF00', '33FF00', '22FF00', '11FF00',
            '00FF00', '00FF11', '00FF22', '00FF33', '00FF44', '00FF55', '00FF66', '00FF77', '00FF88', '00FF99',
            '00FFAA', '00FFBB', '00FFCC', '00FFDD', '00FFEE', '00FFFF', '00EEFF', '00DDFF', '00CCFF', '00BBFF',
            '00AAFF', '0099FF', '0088FF', '0077FF', '0066FF', '0055FF', '0044FF', '0033FF', '0022FF', '0011FF',
            '0000FF', '1100FF', '2200FF', '3300FF', '4400FF', '5500FF', '6600FF', '7700FF', '8800FF', '9900FF',
            'AA00FF', 'BB00FF', 'CC00FF', 'DD00FF', 'EE00FF', 'FF00FF', 'FF00EE', 'FF00DD', 'FF00CC', 'FF00BB',
            'FF00AA', 'FF0099', 'FF0088', 'FF0077', 'FF0066', 'FF0055', 'FF0044', 'FF0033', 'FF0022', 'FF0011'
        ];

        let index = 0;

        if (activeIntervals.has(role.id)) {
            return message.channel.send(`Rainbow effect is already active for role ${role.name}`);
        }

        const interval = setInterval(() => {
            role.setColor(colors[index]);
            index = (index + 1) % colors.length;
        }, 1000);

        activeIntervals.set(role.id, interval);
        message.channel.send(`Started rainbow effect for role ${role.name}`);
    }
};