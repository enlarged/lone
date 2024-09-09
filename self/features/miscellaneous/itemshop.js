const date = new Date();
const format = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
const shopImageUrl = `https://bot.fnbr.co/shop-image/fnbr-shop-${format}.png`;

module.exports = {
    configuration: {
        name: 'itemshop',
        description: 'Get the current Fortnite item shop',
        syntax: 'itemshop',
        example: 'itemshop',
        aliases: ['shop'],
        module: 'miscellaneous'
    },
    run: async (session, message) => {
        message.channel.send({ content: shopImageUrl });
    }
};