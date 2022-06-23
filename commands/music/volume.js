const Discord = require("discord.js");

module.exports = {
    name: "volume",
    aliases: ["vol"],
    description: "Set the volume of the music player",
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
        if (!args[0])
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.error} Please provide a volume level!`,
                    ),
            );
        const volume = parseInt(args[0]);
        if (isNaN(volume))
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.error} Please provide a valid volume level!`,
                    ),
            );
        if (volume > 100)
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.error} Please provide a volume level less than 100!`,
                    ),
            );
        client.distube.setVolume(message, volume);
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `${client.emotes.success} Volume set to ${volume}%!`,
                ),
        );
    },
};
