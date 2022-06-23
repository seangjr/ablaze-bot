const Discord = require("discord.js");

module.exports = {
    name: "connect",
    aliases: ["c"],
    description: "Connect to the voice channel",
    async execute(message, args, client, profileData) {
        if (message.member.voice.channel) {
            try {
                await message.member.voice.channel.join();
            } catch (err) {
                console.log(err);
            }
        } else {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setAuthor(
                        message.author.username,
                        message.author.avatarURL(),
                    )
                    .setDescription(
                        "You must be in a voice channel to use this command!",
                    )
                    .setFooter(
                        `Requested by ${message.author.username}#${message.author.discriminator}`,
                    )
                    .setTimestamp(),
            );
        }
    },
};
