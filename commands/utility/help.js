const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h", "commands"],
    description: "Get a list of all commands",
    async execute(message, args, client, profileData) {
        if (!args[0]) {
            let categories = [];
            try {
                fs.readdirSync("./commands").forEach((dir) => {
                    const files = fs
                        .readdirSync(`./commands/${dir}/`)
                        .filter((file) => file.endsWith(".js"));

                    const cmds = files
                        .filter((command) => {
                            let file = require(`../../commands/${dir}/${command}`);

                            return !file.hidden;
                        })

                        .map((command) => {
                            let file = require(`../../commands/${dir}/${command}`);
                            if (!file.name) return "No command name. ";
                            let name = file.name.replace(".js", "");
                            return `\`${name}\` \`${
                                file.aliases ? file.aliases.join(", ") : ""
                            }\` - ${file.description}`;
                        });
                    let data = new Object();
                    data = {
                        name: dir.toUpperCase(),
                        value:
                            cmds.length === 0 ? "No commands" : cmds.join("\n"),
                    };

                    categories.push(data);
                });
            } catch (err) {
                console.log(err);
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("📬 Need help? Here are all of my commands:")
                .addFields(categories)
                .setFooter(
                    `Requested by ${message.author.username}`,
                    message.author.displayAvatarURL(),
                )
                .setColor(
                    "#" + Math.floor(Math.random() * 16777215).toString(16),
                )
                .setTimestamp();
            return message.channel.send(embed);
        }
    },
};
