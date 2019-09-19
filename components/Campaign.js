const mongoose = require("mongoose");
const fs = require("fs");
const Cp = require("../api/schemas/campaign");
const { prefix } = require("../config.json");

const utils = require("../utils");

class Campaign {
    static start = message => {
        const campaignName = Campaign.getNameFromMessage(message);

        mongoose
            .model("campaign")
            .findOne({ name: campaignName })
            .exec((err, campaign) => {
                if (err) throw err;

                if (campaign) {
                    global.CHANNEL.send(`📚 ${campaignName} already exists!`);
                } else {
                    const newCampaign = new Cp({
                        name: campaignName,
                        startDate: message.createdAt,
                        startMessage: message.id + "",
                        endDate: null,
                        endMessage: null
                    });

                    newCampaign.save(err => {
                        if (err) throw err;

                        global.CHANNEL.send(
                            `📖 A new campaign has started: **${campaignName}**! Have fun everyone!`
                        );
                    });
                }
            });
    };

    static end = message => {
        const campaignName = Campaign.getNameFromMessage(message);

        mongoose
            .model("campaign")
            .findOne({ name: campaignName })
            .exec((err, campaign) => {
                if (err) throw err;

                if (!campaign) {
                    global.CHANNEL.send(
                        `📚 ${campaignName} not found! Please check if you spelled the name correctly and try again!`
                    );
                } else {
                    if (campaign.endDate) {
                        global.CHANNEL.send(
                            `📚 This campaign has already ended!`
                        );
                    } else {
                        campaign.endDate = message.createdAt;
                        campaign.endMessage = message.id + "";
                        campaign.save(err => {
                            if (err) throw err;

                            global.CHANNEL.send(
                                `📕 **${campaignName}** has ended! I'm sure it was very fun! To start a new campaign, please type ` +
                                    "`!trpg campaign start {campaign_name}`!"
                            );
                        });
                    }
                }
            });
    };

    static getLogs = message => {
        const campaignName = Campaign.getNameFromMessage(message);
        global.CHANNEL.send(
            `📚 Compiling messages... *(This might take a bit)*`
        );

        mongoose
            .model("campaign")
            .findOne({ name: campaignName })
            .exec((err, campaign) => {
                if (err) throw err;

                if (!campaign) {
                    global.CHANNEL.send(
                        `📚 ${campaignName} not found! Please check if you spelled the name correctly and try again!`
                    );
                } else {
                    global.CHANNEL.fetchMessages({
                        after: campaign.startMessage
                    }).then(messages => {
                        console.log("all user messages size: ", messages.size);

                        if (campaign.endMessage) {
                            var flag = 1;
                            messages = messages.filter(m => {
                                if (m.id === campaign.endMessage) flag = null;
                                return !flag;
                            });
                            console.log(
                                "ate ao end",
                                messages.size,
                                messages.last().content,
                                messages.first().content
                            );
                        }

                        Campaign.exportLogs(campaignName, messages).then(
                            log => {
                                console.log(log);
                            }
                        );
                    });
                }
            });
    };

    static exportLogs = (campaignName, messages) => {
        console.log("Logging [START]");
        return new Promise((resolve, reject) => {
            const logDate = new Date();
            const filename = `temp/${campaignName.replace(
                / /g,
                "-"
            )}_${logDate.getTime()}.txt`;

            var logger = fs.createWriteStream(filename);

            logger.on("close", ch => {
                global.CHANNEL.send("📝 Here's your file:", {
                    files: [
                        {
                            attachment: filename,
                            name: `SNAP_Logs_${campaignName.replace(
                                / /g,
                                "-"
                            )}_${logDate.getFullYear()}-${logDate.getMonth() +
                                1}-${logDate.getDate()}.txt`
                        }
                    ]
                }).then(message => {
                    // fs.unlink(filename, err => {
                    //     if (err) {
                    //         console.error(err);
                    //         return;
                    //     }
                    // });
                });
            });

            logger.write(
                `SNAP Campaign Logs :: Auto-generated by TRPG Bot :: Generated in ${logDate.getFullYear()}-${logDate.getMonth() +
                    1}-${logDate.getDate()}\n`
            );
            logger.write(`--- {{{ ${campaignName} }}} ---\n\n`);

            messages = Array.from(new Map([...messages].reverse()).values());

            // const authors = Campaign.getPlayersInMessages(messages);
            // console.log("authors: ", authors);

            for (var m of messages) {
                console.log("Author: ", m.author.username);
                console.log("Is bot? ", m.author.bot);
                console.log("Content: ", " > " + m.content + "\n");

                var log = {
                    author: m.author.username,
                    bot: m.author.bot,
                    content: m.author.bot
                        ? m.content.trim()
                        : m.content.replace(/\*\*(.*)\*\*/g, "").trim()
                };

                if (log.content)
                    logger.write(
                        `${log.author}${log.bot ? " (BOT):" : ":"} ${
                            log.content
                        }\n`
                    );
            }

            logger.end();
            resolve("Logging [FINISHED]");
        });
    };

    // static getPlayersInMessages = messages => {
    //     var authors = [];
    //     for (var m of messages) {
    //         if (!authors.includes(m.author.username))
    //             authors.push(m.author.username);
    //     }

    //     return authors;
    // };

    static getNameFromMessage = message => {
        const args = message.content.slice(prefix.length + 1).split(" ");
        args.shift();
        args.shift();
        return args.join(" ");
    };
}

module.exports = Campaign;
