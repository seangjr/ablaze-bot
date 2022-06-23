const Discord = require("discord.js");
const Levels = require("discord-xp");
const DisTube = require("distube");
const config = require("./config.json");

const client = new Discord.Client();
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    searchSongs: true,
    // plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()]
});

const profileModel = require("./models/profileSchema");
require("dotenv").config();
const fs = require("fs");

client.commands = new Discord.Collection();
client.emotes = config.emotes;

fs.readdirSync("./commands/").forEach((dir) => {
    const files = fs
        .readdirSync(`./commands/${dir}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of files) {
        const command = require(`./commands/${dir}/${file}`);
        console.log(`Loaded ${file}`);
        client.commands.set(command.name, command);
    }
});

const functions = fs
    .readdirSync("./functions/")
    .filter((file) => file.endsWith(".js"));

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: "online",
        activity: {
            name: "your mother",
            type: "LISTENING",
        },
    });
});

Levels.setURL(process.env.MONGO_URI);
const prefix = "n!";

client.on("message", async function (message) {
    // levels schema
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    // schema creation
    var profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                guildID: message.guild.id,
                coins: 0,
                bank: 0,
            });
            profile.save();
        }
    } catch (err) {
        console.log(err);
    }
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const commandName = args.shift().toLowerCase();
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (command) =>
                command.aliases && command.aliases.includes(commandName),
        );

    if (!command)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(`\`${commandName}\` doesn't exist!`)
                .setFooter(
                    `Requested by ${message.author.username}#${message.author.discriminator}`,
                )
                .setTimestamp(),
        );

    try {
        command.execute(message, args, client, profileData);
    } catch (err) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(`No permission for \`${commandName}\``)
                .setFooter(
                    `Requested by ${message.author.username}#${message.author.discriminator}`,
                )
                .setTimestamp(),
        );
    }

    // exp
    const randomXP = Math.floor(Math.random() * 10) + 1; //1-11
    const hasLeveledUp = await Levels.appendXp(
        message.author.id,
        message.guild.id,
        randomXP,
    );
    if (hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor(
                    "#" + Math.floor(Math.random() * 16777215).toString(16),
                )
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(`You leveled up to level ${user.level}!`),
        );
    }
});

const status = (queue) =>
    `🔊 Volume: ${queue.volume} | 👹 Filter: ${
        queue.filter || "Off"
    } | 🔁 Loop ${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? "All"
                : "This song"
            : "Off"
    } | 🔄 Autoplay: ${queue.autoplay ? "On" : "Off"}`;
client.distube
    .on("playSong", (message, queue, song) =>
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("PURPLE")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `${client.emotes.play} Now playing: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`,
                )
                .setFooter(status(queue)),
        ),
    )
    .on("addSong", (message, queue, song) =>
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("PURPLE")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `${client.emotes.play} Added to queue: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`,
                )
                .setFooter(status(queue)),
        ),
    )
    .on("playList", (message, queue, playlist, song) =>
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("PURPLE")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `${client.emotes.play} Play \`${playlist.title}\` playlist (${playlist.total_items} songs).\n▶️ Now playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`,
                )
                .setFooter(status(queue))
                .on("addList", (message, queue, playlist) =>
                    message.channel.send(
                        new Discord.MessageEmbed()
                            .setColor("PURPLE")
                            .setAuthor(
                                message.author.username,
                                message.author.avatarURL(),
                            )
                            .setDescription(
                                `${client.emotes.success} Added \`${playlist.title}\` playlist (${playlist.total_items} songs) to queue.`,
                            )
                            .setFooter(status(queue)),
                    ),
                ),
        ),
    )
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("PURPLE")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(
                    `**Choose an option from below**\n${result
                        .map(
                            (song) =>
                                `**${++i}**. ${song.name} - \`${
                                    song.formattedDuration
                                }\``,
                        )
                        .join(
                            "\n",
                        )}\n*Enter anything else or wait 60 seconds to cancel*`,
                ),
        );
    })
    .on("searchCancel", (message) =>
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(`${client.emotes.error} Search cancelled.`),
        ),
    )
    .on("error", (message, err) =>
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setDescription(`${client.emotes.error} Error: \`${err}\``),
        ),
    );

client.login(process.env.DISCORD_TOKEN);

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.dbLogin();
})();
