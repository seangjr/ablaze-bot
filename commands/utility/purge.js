module.exports = {
    name: "purge",
    aliases: ["clear", "prune"],
    description: "Purge messages",
    execute(message, args, client, profileData) {
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send("You don't have permission to do that");
        if (!args[0])
            return message.channel.send(
                "**Please provide a number of messages to delete!**",
            );
        if (args[0] > 100)
            return message.channel.send(
                "**Please provide a number less than 100!**",
            );
        message.channel
            .bulkDelete(args[0])
            .then(() => {
                message.channel.send(
                    `**Successfully deleted ${args[0]} ${
                        "message" + (args[0] > 1 ? "s" : "")
                    }!**`,
                );
            })
            .catch((err) => {
                console.log(err);
            });
    },
};
