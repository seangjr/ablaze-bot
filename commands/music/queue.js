const Discord = require("discord.js");

module.exports = {
    name: "queue",
    description: "Queue music",
    aliases: ["q"],
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
        let q = queue.songs
            .map(
                (song, i) =>
                    `${i === 0 ? "▶️ **Playing:**" : `${i}.`} \`${
                        song.name
                    }\` - \`${song.formattedDuration}\``,
            )
            .join("\n");
        const queueEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(`${client.emotes.queue} **Server queue**\n${q}`);
        message.channel.send(queueEmbed);
    },
};
