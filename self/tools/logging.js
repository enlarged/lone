const colors = require('colors');

function logger(level, message) {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const formattedLog = `(${time})`.blue.bold + ` ${level.toUpperCase()}`.cyan + ` ${message}`;
    console.log(formattedLog);
}

module.exports = {
    logger
};
