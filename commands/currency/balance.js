const Discord = require("discord.js");

module.exports = {
    name: "balance",
    description: "Check your balance",
    aliases: ["bal", "money", "balance"],
    execute(message, args, client, profileData) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("Balance")
                .setColor(
                    "#" + Math.floor(Math.random() * 16777215).toString(16),
                )
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(
                    `You have **${profileData.coins}** coins in your wallet.\nYou have **${profileData.bank}** coins in your bank account.`,
                )
                .setFooter(
                    `Requested by ${message.author.username}#${message.author.discriminator}`,
                )
                .setTimestamp(),
        );
    },
};
