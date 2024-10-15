const pagination = async (session, initialMessage, messages) => {
    let index = 0;
    let cancelStatus = false;

    const editMessage = async () => {
        await initialMessage.edit(messages[index]);
    };

    await editMessage();

    const filter = (m) => m.author.id === initialMessage.author.id;
    const collector = initialMessage.channel.createMessageCollector({
        filter,
        time: 100000,
    });

    collector.on("collect", async (m) => {
        const content = m.content.toLowerCase();

        if (content === "next") {
            index = (index + 1) % messages.length;
            await editMessage();
        } else if (content === "back") {
            index = (index - 1 + messages.length) % messages.length;
            await editMessage();
        } else if (content === "cancel") {
            cancelStatus = true;
            collector.stop();
            await initialMessage.delete();
        } else {
            return;
        }

        await m.delete();
    });

    collector.on("end", async () => {
        if (!cancelStatus) {
            await initialMessage.delete();
        }
    });
};

module.exports = pagination;