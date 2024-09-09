const axios = require("axios");

module.exports = {
  configuration: {
    name: 'banner',
    aliases: ['none'],
    description: 'Get the banner of a member or yourself',
    syntax: 'banner <member>',
    example: 'banner @c2rter',
    module: 'information',
  },
  run: async (session, message, args) => {
    try {
      const user = args.length > 0 
        ? message.mentions.members.first()?.user || await message.guild.members.fetch(args[0]).catch(() => null) || await session.users.fetch(args[0]).catch(() => null)
        : message.author;

      if (!user) return message.react('❌');

      const { data } = await axios.get(`https://discord.com/api/users/${user.id}`, {
        headers: { Authorization: `Bot ${session.bot}` },
      });

      if (data.banner) {
        const extension = data.banner.startsWith("a_") ? ".gif" : ".png";
        const url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${extension}?size=2048`;
        message.channel.send({ content: `# ${user.tag}'s banner`, files: [url] });
      } else {
        message.react('❌');
      }
    } catch (error) {
      session.log('ERROR ', error);
      message.react('❌');
    }
  }
};