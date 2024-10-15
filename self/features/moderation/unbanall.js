module.exports = {
    configuration: {
        name: 'unbanall',
        description: 'Unban all banned members in the server',
        syntax: 'unbanall',
        example: 'unbanall',
        aliases: [''],
        module: 'moderation'
    },
    run: async (session, message, args) => {
        const bans = await message.guild.bans.fetch();

        if (bans.size === 0) {
            return session.warn(session, message, "There are no members to unban");
        }

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (const ban of bans.values()) {
            await message.guild.members.unban(ban.user.id);
            await delay(1000); 
        }

        return session.grant(session, message, `Unbanned ${bans.size} members`);
    }
}