const Levels = require("discord-xp");
const Discord = require("discord.js");

module.exports = {
    name: "level",
    aliases: ["lvl", "l"],
    description: "Check your level",
    async execute(message, args, client, profileData) {
        let mentionedMember =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);
        if (!mentionedMember) mentionedMember = message.member;

        const target = await Levels.fetch(mentionedMember.id, message.guild.id);
        if (!target)
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setAuthor(
                        message.author.username,
                        message.author.avatarURL(),
                    )
                    .setDescription(
                        `${mentionedMember.user.username} has no XP!`,
                    ),
            );
        try {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor(
                        "#" + Math.floor(Math.random() * 16777215).toString(16),
                    )
                    .setAuthor(
                        message.author.username,
                        message.author.avatarURL(),
                    )
                    .setDescription(
                        `${mentionedMember.user.tag} is Level ${
                            target.level
                        } and has ${target.xp}/${Levels.xpFor(
                            target.level + 1,
                        )} XP!`,
                    ),
            );
        } catch (error) {
            console.log(error);
        }
    },
};
