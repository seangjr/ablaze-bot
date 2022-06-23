const Discord = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
    name: "beg",
    description: "Beg for money",
    aliases: ["b"],
    async execute(message, args, client, profileData) {
        const randomNumber = Math.floor(Math.random() * 50) + 1;
        const response = await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            },
            {
                $inc: {
                    coins: randomNumber,
                },
            },
        );
        return message.channel.send(
            new Discord.MessageEmbed()
                .setColor(
                    "#" + Math.floor(Math.random() * 16777215).toString(16),
                )
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(
                    `You begged and received ${randomNumber} coins.`,
                )
                .setTimestamp(),
        );
    },
};
