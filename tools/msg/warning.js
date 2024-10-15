function warn(session, message, error) {
    if (message.guild && message.guild.available) {
        return message.channel.send({ content: `\`\`\`ini\n[ Lone ]\`\`\`\`\`\`asciidoc\n${error}\`\`\`` })
            .then(sentMessage => {
                setTimeout(() => {
                    sentMessage.delete().catch(console.error);
                }, 6000);
            })
            message.delete().catch(console.error);
    }
}

module.exports = {
    warn
};