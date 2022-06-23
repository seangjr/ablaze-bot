const Discord = require("discord.js");

module.exports = {
    name: "play",
    aliases: ["p"],
    description: "Play music",
    execute(message, args, client, profileData) {
        if (!message.member.hasPermission("CONNECT"))
            return message.channel.send("You don't have permission to do that");
        if (!args[0])
            return message.channel.send(
                "**Please provide a link or query to a song!**",
            );
        try {
            client.distube.play(message, args.join(" "));
        } catch (e) {
            console.log(e);
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setAuthor(
                        message.author.username,
                        message.author.avatarURL(),
                    )
                    .setDescription(
                        "An error occurred while trying to play the song!",
                    )
                    .setFooter(
                        `Requested by ${message.author.username}#${message.author.discriminator}`,
                    )
                    .setTimestamp(),
            );
        }
    },
};
