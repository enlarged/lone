const DDG = require('duck-duck-scrape');

module.exports = {
    configuration: {
        name: 'google',
        aliases: ['g'],
        description: 'Search the largest search engine on the internet',
        syntax: 'google (search)',
        example: 'google how to get a girlfriend',
        module: 'utility'
    },
    run: async (session, message, args) => {
        if (!args.length) {
            return session.command(module.exports, session, message);
        }

        try {
            const searchResults = await DDG.search(args.join(' '), {
                safeSearch: DDG.SafeSearchType.STRICT
            });

            if (!searchResults.results || !searchResults.results.length) {
                return message.react('❌');
            }

            const resultsToShow = searchResults.results.slice(0, 2);
            const resultsText = resultsToShow.map(result => 
                `**${result.title}**\n<${result.url}>\n${result.rawDescription.replace(/<\/?b>|<\/?s>/g, '')}`
            ).join('\n\n');

            message.channel.send(resultsText);

        } catch (error) {
            session.log('Error fetching DuckDuckGo search results:', error);
            return message.react('❌');
        }
    }
};