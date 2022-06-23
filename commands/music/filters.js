const Discord = require("discord.js");

module.exports = {
    name: "filter",
    description: "Filter the music",
    aliases: ["f"],
    execute(message, args, client, profileData) {
        const queue = client.distube.getQueue(message);
        if (!queue)
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.error} There is nothing in the queue right now!`,
                    ),
            );
        if (args[0] === "off" && queue.filter)
            client.distube.setFilter(message, args[0]);
        else if (Object.keys(client.distube.filters).includes(args[0]))
            client.distube.setFilter(message, args[0]);
        else if (args[0])
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.error} The filter ${args[0]} does not exist!`,
                    ),
            );
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `${client.emotes.success} Set the filter to ${queue.filter}!`,
                ),
        );
    },
};
