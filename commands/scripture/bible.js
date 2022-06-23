const Bible = require("bible.js");

module.exports = {
    name: "bible",
    aliases: ["b"],
    description: "Get a verse/multiple verses from the bible",
    execute(message, args, client, profileData) {
        Bible.init(
            {
                versions: {
                    en: {
                        source: "https://github.com/BibleJS/bible-english",
                        version: "master",
                        language: "en",
                    },
                },
            },
            (err) => {
                if (err) throw err;

                const displayVerses = (lang) => {
                    return (err, data) => {
                        if (err) {
                            throw err;
                        }

                        (data || []).forEach((c) => {
                            message.channel.send(
                                `**${c.bookname} ${c.chapter}:${c.verse}**\n\`${c.text}\``,
                            );
                        });
                    };
                };

                const enBible = new Bible({
                    language: "en",
                });
                enBible.get(args.join(" "), displayVerses("en"));
            },
        );
    },
};
