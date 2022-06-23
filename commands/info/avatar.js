const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av", "pfp"],
    description: "Get the avatar of a user",
    async execute(message, args, client, profileData) {
        let mentionedMember =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);
        if (!mentionedMember) mentionedMember = message.member;

        try {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor(
                        "#" + Math.floor(Math.random() * 16777215).toString(16),
                    )
                    .setAuthor(
                        "Dauntless Bot",
                        "https://i.ibb.co/rHVML5q/Untitled-design.png",
                    )
                    .setImage(
                        mentionedMember.user.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                        }),
                    ),
            );
        } catch (error) {
            console.log(error);
        }
    },
};
