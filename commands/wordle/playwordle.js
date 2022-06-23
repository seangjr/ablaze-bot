const Wordle = require("../../wordle");

module.exports = {
    name: "playwordle",
    description: "Play Wordle!",
    aliases: ["pw"],
    execute(message, args, client, profileData) {
        Wordle.LoadNewWordle(message);
    },
};
