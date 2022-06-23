const Discord = require("discord.js");
const Levels = require("discord-xp");
const fs = require("fs");
var csv = require("jquery-csv");
const Canvas = require("canvas");

function GetAnswer() {
    var j = Math.floor(Math.random() * answers.length);
    return answers[j].toUpperCase();
}

const ValidGuess = (guess) => {
    if (guess === undefined) return false;
    if (guess.length != 5) return false;
    return true;
};

const GetTodaysDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
};

const PlayedToday = (dateData) => {
    if (GetTodaysDate() == dateData) return true;

    return false;
};

const AddSpace = (data) => {
    if (data.length == 0) return "";
    return " ";
};

const GetImage = (guessLetter, answerLetter, i) => {
    if (guessLetter === undefined) return 0;
    if (guessLetter.charAt(i) == answerLetter.charAt(i)) return 1;
    if (answerLetter.includes(guessLetter.charAt(i))) return 2;
    return 3;
};

function writeToCSVFile(newData) {
    const filename = "data.csv";
    let csvContent =
        "data:text/csv;charset=utf-8," +
        newData.map((e) => e.join(",")).join("\n");

    fs.writeFile(filename, csvContent, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("The file has been saved!");
        }
    });
}

async function LoadGame(msg, guesses, answer) {
    const canvas = Canvas.createCanvas(330, 397);
    const ctx = canvas.getContext("2d");
    const background = await Canvas.loadImage("./images/BlankImage.png");
    ctx.drawImage(background, 0, 0, canvas.widtth, canvas.height);

    ctx.font = "42px Clear Sans, Helvetica Neue, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#d7dadc";

    const absentSquare = await Canvas.loadImage("./images/ColorAbsent.png");
    const emptySquare = await Canvas.loadImage("./images/EmptySquare.png");
    const greenSquare = await Canvas.loadImage("./images/GreenSquare.png");
    const yellowSquare = await Canvas.loadImage("./images/YellowSquare.png");

    let square = absentSquare;

    let squareSize = 62;
    let rowOffset = 0;
    let buffer = 0;

    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 5; i++) {
            const imageNumber = GetImage(guesses[j], answer, i);
            if (imageNumber == 1) {
                square = greenSquare;
            } else if (imageNumber == 2) {
                square = yellowSquare;
            } else if (imageNumber == 3) {
                square = absentSquare;
            } else if (imageNumber == 0) {
                square = emptySquare;
            }
            ctx.drawImage(
                square,
                i * squareSize + buffer,
                rowOffset,
                squareSize,
                squareSize,
            );
            if (guesses[j] != undefined) {
                ctx.fillText(
                    guesses[j].charAt(i),
                    i * squareSize + buffer + squareSize / 2,
                    rowOffset + 42,
                );
            }

            buffer += 5;
        }
        buffer = 0;
        rowOffset += squareSize + 5;
    }

    const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "wordle.png",
    );
    msg.reply(attachment);
}

async function Guess(msg, guesses, newGuess, answer) {
    const canvas = Canvas.createCanvas(330, 397);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./images/BlankImage.png");
    ctx.drawImage(background, 0, 0, canvas.widtth, canvas.height);

    ctx.font = "42px Clear Sans, Helvetica Neue, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#d7dadc";

    console.log("Answer", answer);
    console.log("Guess", newGuess);

    const absentSquare = await Canvas.loadImage("./images/ColorAbsent.png");
    const emptySquare = await Canvas.loadImage("./images/EmptySquare.png");
    const greenSquare = await Canvas.loadImage("./images/GreenSquare.png");
    const yellowSquare = await Canvas.loadImage("./images/YellowSquare.png");

    let square = absentSquare;
    let squareSize = 62;
    let rowOffset = 0;
    let buffer = 0;

    if (guesses == "") {
        guesses[0] = newGuess;
    } else {
        guesses.push(newGuess);
    }

    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 5; i++) {
            const imageNumber = GetImage(guesses[j], answer, i);
            if (imageNumber == 1) {
                square = greenSquare;
            } else if (imageNumber == 2) {
                square = yellowSquare;
            } else if (imageNumber == 3) {
                square = absentSquare;
            } else if (imageNumber == 0) {
                square = emptySquare;
            }
            ctx.drawImage(
                square,
                i * squareSize + buffer,
                rowOffset,
                squareSize,
                squareSize,
            );
            if (guesses[j] != undefined) {
                ctx.fillText(
                    guesses[j].charAt(i),
                    i * squareSize + buffer + squareSize / 2,
                    rowOffset + 42,
                );
            }

            buffer += 5;
        }

        buffer = 0;
        rowOffset += squareSize + 5;
    }
    const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "wordle.png",
    );
    msg.reply(attachment);
}

function LoadNewWordle(msg) {
    fs.readFile("data.csv", "utf-8", (err, fileContent) => {
        if (err) {
            console.log(err);
        }
        csv.toArrays(fileContent, {}, (err, data) => {
            if (err) console.log(err);
            if (data.length == 0) {
                data[0] = [
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "user",
                    "wordOfTheDay",
                    "canGuess",
                    "lastGuessDate",
                    "guesses",
                    "wins",
                    "games",
                    "hasCompletedToday",
                ];
            }
            for (let i = 1, len = data.length; i < len; i++) {
                if (data[i][0] == msg.author.id) {
                    if (PlayedToday(data[i][3])) {
                        if (!msg.content.includes("force")) {
                            msg.channel.send(
                                `<@${msg.author.id}>`,
                                new Discord.MessageEmbed()
                                    .setColor("#ff0000")
                                    .setTitle("You have already played today!")
                                    .setDescription(
                                        "You can only play **once** per day! Use `n!pw or n!playwordle force` to play anyway.",
                                    )
                                    .setFooter("Wordle")
                                    .setTimestamp(),
                            );
                            return;
                        }
                    }

                    data[i][1] = GetAnswer();
                    data[i][3] = GetTodaysDate();
                    data[i][4] = "";
                    data[i][8] = false;

                    writeToCSVFile(data);
                    LoadGame(msg, data[i][4], data[i][1]);
                    return;
                }
            }

            data.push([
                msg.author.id,
                GetAnswer(),
                "false",
                GetTodaysDate(),
                ,
                0,
                0,
                0,
                false,
            ]);
            writeToCSVFile(data);
            LoadGame(msg, "", "");
        });
    });
}

function PlayWordle(msg) {
    fs.readFile("data.csv", "utf-8", (err, fileContent) => {
        if (err) {
            console.log(err);
        }
        csv.toArrays(fileContent, {}, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data.length == 0) {
                data[0] = [
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "data:text/csv;charset=utf-8",
                    "user",
                    "wordOfTheDay",
                    "canGuess",
                    "lastGuessDate",
                    "guesses",
                    "wins",
                    "games",
                    "hasCompletedToday",
                ];
            }
            for (let i = 1, len = data.length; i < len; i++) {
                if (data[i][0] == msg.author.id) {
                    if (data[i][8] == "true") {
                        msg.channel.send(
                            `<@${msg.author.id}>`,
                            new Discord.MessageEmbed()
                                .setColor("#ff0000")
                                .setTitle("You have already played today!")
                                .setDescription(
                                    "Get a new wordle by using `d!pw`.",
                                )
                                .setFooter("Wordle")
                                .setTimestamp(),
                        );
                        msg.reply("you have already completed a wordle today!");
                        return;
                    }

                    var guess = msg.content.split(" ")[1];

                    //Guess checks
                    if (!ValidGuess(guess)) {
                        msg.channel.send(
                            `<@${msg.author.id}>\n`,
                            new Discord.MessageEmbed()
                                .setTitle("Invalid Guess")
                                .setDescription(
                                    "Please enter a valid guess.\nGuesses must be 5 characters long and contain only the following characters: a-z, A-Z, 0-9, and _",
                                )
                                .setColor("#ff0000")
                                .setFooter("Wordle")
                                .setTimestamp(),
                        );
                        return;
                    }

                    //clean data and update file
                    var guesses = data[i][4].split(" ");
                    guess = guess.toUpperCase();
                    data[i][4] = data[i][4] + AddSpace(data[i][4]) + guess;
                    writeToCSVFile(data);

                    Guess(msg, guesses, guess, data[i][1]);

                    //check to see if guess and answer match
                    for (var c = 0; c < guess.length; c++) {
                        if (guess.charCodeAt(c) != data[i][1].charCodeAt(c)) {
                            if (guesses.length === 5) {
                                data[i][8] = true;
                                data[i][7]++;
                                writeToCSVFile(data);
                                msg.channel.send(
                                    `<@${msg.author.id}>`,
                                    new Discord.MessageEmbed()
                                        .setTitle("Game over!")
                                        .setDescription(
                                            `You failed to guess the word! The answer was: ${data[i][1]}. Play again tomorrow by using \`d!pw\``,
                                        )
                                        .setColor("#ff0000")
                                        .setFooter("Wordle")
                                        .setTimestamp(),
                                );
                            }
                            return;
                        }
                    }

                    data[i][8] = true;
                    data[i][6]++;
                    data[i][7]++;
                    writeToCSVFile(data);
                    Levels.appendXp(msg.author.id, msg.guild.id, 100);
                    msg.channel.send(
                        `<@${msg.author.id}>\n`,
                        new Discord.MessageEmbed()
                            .setTitle("Congratulations!")
                            .setDescription(
                                `You guessed the word **${data[i][1]}** in ${
                                    guesses.length + 1
                                } tries!\nPlay again tomorrow by using \`d!pw\`\nYou have earned 100 XP!`,
                            )
                            .setColor("#00ff00")
                            .setFooter("Wordle")
                            .setTimestamp(),
                    );
                    return;
                }
            }
            msg.channel.send(
                `<@${msg.author.id}>`,
                new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("You have not played today!")
                    .setDescription("Get a new wordle by using `d!pw`.")
                    .setFooter("Wordle")
                    .setTimestamp(),
            );
        });
    });
}

function ShowWordleStats(msg) {
    fs.readFile("data.csv", "utf-8", (err, fileContent) => {
        if (err) {
            console.log(err);
        }
        csv.toArrays(fileContent, {}, (err, data) => {
            if (err) {
                console.log(err);
            }
            for (let i = 1, len = data.length; i < len; i++) {
                if (data[i][0] == msg.author.id) {
                    var wins = data[i][6];
                    var games = data[i][7];
                    var result = Math.round((wins / games) * 100);

                    msg.channel.send(
                        `<@${msg.author.id}>\n`,
                        new Discord.MessageEmbed()
                            .setTitle("Wordle Stats")
                            .setAuthor(
                                msg.author.username,
                                msg.author.avatarURL(),
                            )
                            .addField("Wins 👍🏻", wins)
                            .addField("Games 🎮", games)
                            .addField("Win rate 🎯", result + "%")
                            .setColor(
                                "#" +
                                    Math.floor(
                                        Math.random() * 16777215,
                                    ).toString(16),
                            )
                            .setFooter("Wordle")
                            .setTimestamp(),
                    );
                    return;
                }
            }

            data[data.length] = [msg.author.id, "", "false", "", "", "0", "0"];

            msg.channel.send(
                `<@${msg.author.id}>\n` +
                    new Discord.MessageEmbed()
                        .setTitle("Wordle Stats")
                        .setAuthor(msg.author.username, msg.author.avatarURL())
                        .addField("Wins 👍🏻", wins)
                        .addField("Games 🎮", games)
                        .addField("Win rate 🎯", result + "%")
                        .setColor(
                            "#" +
                                Math.floor(Math.random() * 16777215).toString(
                                    16,
                                ),
                        )
                        .setFooter("Wordle")
                        .setTimestamp(),
            );
            writeToCSVFile(data);
        });
    });
}

module.exports = { LoadNewWordle, PlayWordle, ShowWordleStats };

answers = [
    "ABUSE",

    "ADULT",

    "AGENT",

    "ANGER",

    "APPLE",

    "AWARD",

    "BASIS",

    "BEACH",

    "BIRTH",

    "BLOCK",

    "BLOOD",

    "BOARD",

    "BRAIN",

    "BREAD",

    "BREAK",

    "BROWN",

    "BUYER",

    "CAUSE",

    "CHAIN",

    "CHAIR",

    "CHEST",

    "CHIEF",

    "CHILD",

    "CHINA",

    "CLAIM",

    "CLASS",

    "CLOCK",

    "COACH",

    "COAST",

    "COURT",

    "COVER",

    "CREAM",

    "CRIME",

    "CROSS",

    "CROWD",

    "CROWN",

    "CYCLE",

    "DANCE",

    "DEATH",

    "DEPTH",

    "DOUBT",

    "DRAFT",

    "DRAMA",

    "DREAM",

    "DRESS",

    "DRINK",

    "DRIVE",

    "EARTH",

    "ENEMY",

    "ENTRY",

    "ERROR",

    "EVENT",

    "FAITH",

    "FAULT",

    "FIELD",

    "FIGHT",

    "FINAL",

    "FLOOR",

    "FOCUS",

    "FORCE",

    "FRAME",

    "FRANK",

    "FRONT",

    "FRUIT",

    "GLASS",

    "GRANT",

    "GRASS",

    "GREEN",

    "GROUP",

    "GUIDE",

    "HEART",

    "HENRY",

    "HORSE",

    "HOTEL",

    "HOUSE",

    "IMAGE",

    "INDEX",

    "INPUT",

    "ISSUE",

    "JAPAN",

    "JONES",

    "JUDGE",

    "KNIFE",

    "LAURA",

    "LAYER",

    "LEVEL",

    "LEWIS",

    "LIGHT",

    "LIMIT",

    "LUNCH",

    "MAJOR",

    "MARCH",

    "MATCH",

    "METAL",

    "MODEL",

    "MONEY",

    "MONTH",

    "MOTOR",

    "MOUTH",

    "MUSIC",

    "NIGHT",

    "NOISE",

    "NORTH",

    "NOVEL",

    "NURSE",

    "OFFER",

    "ORDER",

    "OTHER",

    "OWNER",

    "PANEL",

    "PAPER",

    "PARTY",

    "PEACE",

    "PETER",

    "PHASE",

    "PHONE",

    "PIECE",

    "PILOT",

    "PITCH",

    "PLACE",

    "PLANE",

    "PLANT",

    "PLATE",

    "POINT",

    "POUND",

    "POWER",

    "PRESS",

    "PRICE",

    "PRIDE",

    "PRIZE",

    "PROOF",

    "QUEEN",

    "RADIO",

    "RANGE",

    "RATIO",

    "REPLY",

    "RIGHT",

    "RIVER",

    "ROUND",

    "ROUTE",

    "RUGBY",

    "SCALE",

    "SCENE",

    "SCOPE",

    "SCORE",

    "SENSE",

    "SHAPE",

    "SHARE",

    "SHEEP",

    "SHEET",

    "SHIFT",

    "SHIRT",

    "SHOCK",

    "SIGHT",

    "SIMON",

    "SKILL",

    "SLEEP",

    "SMILE",

    "SMITH",

    "SMOKE",

    "SOUND",

    "SOUTH",

    "SPACE",

    "SPEED",

    "SPITE",

    "SPORT",

    "SQUAD",

    "STAFF",

    "STAGE",

    "START",

    "STATE",

    "STEAM",

    "STEEL",

    "STOCK",

    "STONE",

    "STORE",

    "STUDY",

    "STUFF",

    "STYLE",

    "SUGAR",

    "TABLE",

    "TASTE",

    "TERRY",

    "THEME",

    "THING",

    "TITLE",

    "TOTAL",

    "TOUCH",

    "TOWER",

    "TRACK",

    "TRADE",

    "TRAIN",

    "TREND",

    "TRIAL",

    "TRUST",

    "TRUTH",

    "UNCLE",

    "UNION",

    "UNITY",

    "VALUE",

    "VIDEO",

    "VISIT",

    "VOICE",

    "WASTE",

    "WATCH",

    "WATER",

    "WHILE",

    "WHITE",

    "WHOLE",

    "WOMAN",

    "WORLD",

    "YOUTH",

    "ALCON",

    "AUGHT",

    "HELLA",

    "ONE’S",

    "OUGHT",

    "THAME",

    "THERE",

    "THINE",

    "THINE",

    "WHERE",

    "WHICH",

    "WHOSE",

    "WHOSO",

    "YOURS",

    "YOURS",

    "ADMIT",

    "ADOPT",

    "AGREE",

    "ALLOW",

    "ALTER",

    "APPLY",

    "ARGUE",

    "ARISE",

    "AVOID",

    "BEGIN",

    "BLAME",

    "BREAK",

    "BRING",

    "BUILD",

    "BURST",

    "CARRY",

    "CATCH",

    "CAUSE",

    "CHECK",

    "CLAIM",

    "CLEAN",

    "CLEAR",

    "CLIMB",

    "CLOSE",

    "COUNT",

    "COVER",

    "CROSS",

    "DANCE",

    "DOUBT",

    "DRINK",

    "DRIVE",

    "ENJOY",

    "ENTER",

    "EXIST",

    "FIGHT",

    "FOCUS",

    "FORCE",

    "GUESS",

    "IMPLY",

    "ISSUE",

    "JUDGE",

    "LAUGH",

    "LEARN",

    "LEAVE",

    "LET’S",

    "LIMIT",

    "MARRY",

    "MATCH",

    "OCCUR",

    "OFFER",

    "ORDER",

    "PHONE",

    "PLACE",

    "POINT",

    "PRESS",

    "PROVE",

    "RAISE",

    "REACH",

    "REFER",

    "RELAX",

    "SERVE",

    "SHALL",

    "SHARE",

    "SHIFT",

    "SHOOT",

    "SLEEP",

    "SOLVE",

    "SOUND",

    "SPEAK",

    "SPEND",

    "SPLIT",

    "STAND",

    "START",

    "STATE",

    "STICK",

    "STUDY",

    "TEACH",

    "THANK",

    "THINK",

    "THROW",

    "TOUCH",

    "TRAIN",

    "TREAT",

    "TRUST",

    "VISIT",

    "VOICE",

    "WASTE",

    "WATCH",

    "WORRY",

    "WOULD",

    "WRITE",

    "ABOVE",

    "ACUTE",

    "ALIVE",

    "ALONE",

    "ANGRY",

    "AWARE",

    "AWFUL",

    "BASIC",

    "BLACK",

    "BLIND",

    "BRAVE",

    "BRIEF",

    "BROAD",

    "BROWN",

    "CHEAP",

    "CHIEF",

    "CIVIL",

    "CLEAN",

    "CLEAR",

    "CLOSE",

    "CRAZY",

    "DAILY",

    "DIRTY",

    "EARLY",

    "EMPTY",

    "EQUAL",

    "EXACT",

    "EXTRA",

    "FAINT",

    "FALSE",

    "FIFTH",

    "FINAL",

    "FIRST",

    "FRESH",

    "FRONT",

    "FUNNY",

    "GIANT",

    "GRAND",

    "GREAT",

    "GREEN",

    "GROSS",

    "HAPPY",

    "HARSH",

    "HEAVY",

    "HUMAN",

    "IDEAL",

    "INNER",

    "JOINT",

    "LARGE",

    "LEGAL",

    "LEVEL",

    "LIGHT",

    "LOCAL",

    "LOOSE",

    "LUCKY",

    "MAGIC",

    "MAJOR",

    "MINOR",

    "MORAL",

    "NAKED",

    "NASTY",

    "NAVAL",

    "OTHER",

    "OUTER",

    "PLAIN",

    "PRIME",

    "PRIOR",

    "PROUD",

    "QUICK",

    "QUIET",

    "RAPID",

    "READY",

    "RIGHT",

    "ROMAN",

    "ROUGH",

    "ROUND",

    "ROYAL",

    "RURAL",

    "SHARP",

    "SHEER",

    "SHORT",

    "SILLY",

    "SIXTH",

    "SMALL",

    "SMART",

    "SOLID",

    "SORRY",

    "SPARE",

    "STEEP",

    "STILL",

    "SUPER",

    "SWEET",

    "THICK",

    "THIRD",

    "TIGHT",

    "TOTAL",

    "TOUGH",

    "UPPER",

    "UPSET",

    "URBAN",

    "USUAL",

    "VAGUE",

    "VALID",

    "VITAL",

    "WHITE",

    "WHOLE",

    "WRONG",

    "YOUNG",

    "AFORE",

    "AFTER",

    "BOTHE",

    "OTHER",

    "SINCE",

    "SLASH",

    "UNTIL",

    "WHERE",

    "WHILE",

    "ABACK",

    "ABAFT",

    "ABOON",

    "ABOUT",

    "ABOVE",

    "ACCEL",

    "ADOWN",

    "AFOOT",

    "AFORE",

    "AFOUL",

    "AFTER",

    "AGAIN",

    "AGAPE",

    "AGOGO",

    "AGONE",

    "AHEAD",

    "AHULL",

    "ALIFE",

    "ALIKE",

    "ALINE",

    "ALOFT",

    "ALONE",

    "ALONG",

    "ALOOF",

    "ALOUD",

    "AMISS",

    "AMPLY",

    "AMUCK",

    "APACE",

    "APART",

    "APTLY",

    "AREAR",

    "ASIDE",

    "ASKEW",

    "AWFUL",

    "BADLY",

    "BALLY",

    "BELOW",

    "CANNY",

    "CHEAP",

    "CLEAN",

    "CLEAR",

    "COYLY",

    "DAILY",

    "DIMLY",

    "DIRTY",

    "DITTO",

    "DRILY",

    "DRYLY",

    "DULLY",

    "EARLY",

    "EXTRA",

    "FALSE",

    "FATLY",

    "FEYLY",

    "FIRST",

    "FITLY",

    "FORTE",

    "FORTH",

    "FRESH",

    "FULLY",

    "FUNNY",

    "GAILY",

    "GAYLY",

    "GODLY",

    "GREAT",

    "HAPLY",

    "HEAVY",

    "HELLA",

    "HENCE",

    "HOTLY",

    "ICILY",

    "INFRA",

    "INTL.",

    "JILDI",

    "JOLLY",

    "LAXLY",

    "LENTO",

    "LIGHT",

    "LOWLY",

    "MADLY",

    "MAYBE",

    "NEVER",

    "NEWLY",

    "NOBLY",

    "ODDLY",

    "OFTEN",

    "OTHER",

    "OUGHT",

    "PARTY",

    "PIANO",

    "PLAIN",

    "PLONK",

    "PLUMB",

    "PRIOR",

    "QUEER",

    "QUICK",

    "QUITE",

    "RAMEN",

    "RAPID",

    "REDLY",

    "RIGHT",

    "ROUGH",

    "ROUND",

    "SADLY",

    "SECUS",

    "SELLY",

    "SHARP",

    "SHEER",

    "SHILY",

    "SHORT",

    "SHYLY",

    "SILLY",

    "SINCE",

    "SLEEK",

    "SLYLY",

    "SMALL",

    "SOUND",

    "SPANG",

    "SRSLY",

    "STARK",

    "STILL",

    "STONE",

    "STOUR",

    "SUPER",

    "TALLY",

    "TANTO",

    "THERE",

    "THICK",

    "TIGHT",

    "TODAY",

    "TOMOZ",

    "TRULY",

    "TWICE",

    "UNDER",

    "UTTER",

    "VERRY",

    "WANLY",

    "WETLY",

    "WHERE",

    "WRONG",

    "WRYLY",

    "ABAFT",

    "ABOON",

    "ABOUT",

    "ABOVE",

    "ADOWN",

    "AFORE",

    "AFTER",

    "ALONG",

    "ALOOF",

    "AMONG",

    "BELOW",

    "CIRCA",

    "CROSS",

    "FURTH",

    "MINUS",

    "NEATH",

    "ROUND",

    "SINCE",

    "SPITE",

    "UNDER",
];
