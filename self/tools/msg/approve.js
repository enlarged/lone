function grant(session, message, error) {
    if (message.guild && message.guild.available) {
        message.channel.send({ content: `\`\`\`ini\n[ Lone ]\`\`\`\`\`\`asciidoc\n${error}\`\`\`` })
            .then(sentMessage => {
                setTimeout(() => {
                    sentMessage.delete().catch(console.error);
                }, 6000);
            })
            .catch(console.error);

        message.delete().catch(console.error);
    }
}

module.exports = {
    grant
};