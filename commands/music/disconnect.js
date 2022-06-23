const Discord = require("discord.js");

module.exports = {
    name: "disconnect",
    aliases: ["dc"],
    description: "Disconnect from the voice channel",
    async execute(message, args, client, profileData) {
        if (message.member.voice.channel) {
            try {
                await message.member.voice.channel.leave();
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
                        "If you are not in a voice channel, you can use the command `connect` to join one!",
                    )
                    .setTimestamp(),
            );
        }
    },
};
