const Discord = require("discord.js");

module.exports = {
    name: "skip",
    description: "Skip the current song",
    aliases: ["s"],
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
        client.distube.skip(message);
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `${client.emotes.success} Skipped the current song! Now playing: \`${queue.songs[0].name}\``,
                ),
        );
    },
};
