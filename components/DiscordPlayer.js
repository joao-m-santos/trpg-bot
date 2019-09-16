const mongoose = require("mongoose");
const Player = require("../api/schemas/player");

const utils = require("../utils");
const errors = require("../errors");

class DiscordPlayer {
    constructor(author) {
        this.id = author.id.toString(10);
        this.name = author.username;
    }

    register = () => {
        mongoose
            .model("player")
            .findOne({ discordID: this.id }, (err, player) => {
                if (err) throw err;

                if (player) {
                    global.CHANNEL.send(`🤦‍♀️ You're already registered!`);
                    if (player.sheets && player.sheets.length > 0)
                        global.CHANNEL.send(
                            `You even have like ${player.sheets.length -
                                1} or ${player.sheets.length} sheets!`
                        );
                    else
                        global.CHANNEL.send(
                            "You still don't have any sheets thought. Register one by uploading a .txt file with the command `!trpg sheet register`"
                        );
                } else {
                    const player = new Player({
                        _id: new mongoose.Types.ObjectId(),
                        name: this.name,
                        discordID: this.id,
                        sheets: [],
                        currentSheet: null
                    });
                    player.save(err => {
                        if (err) throw err;

                        global.CHANNEL.send(
                            "🌟 You've been registered as a Player! Register your first sheet by uploading a .txt file with the command `!trpg sheet register`"
                        );
                    });
                }
            });
    };

    listSheets = () => {
        mongoose
            .model("player")
            .findOne({ discordID: this.id })
            .populate("sheets")
            .exec((err, player) => {
                if (err) throw err;

                if (player) {
                    if (player.currentSheet) {
                        global.CHANNEL.send(
                            `You are currently playing as ${
                                player.sheets.find(
                                    s =>
                                        s.sheetID ===
                                        player.currentSheet.sheetID
                                ).profile.name
                            }`
                        );
                    } else {
                        global.CHANNEL.send(
                            "Here are your available sheets. Select a character to play as by typing `!trpg player {id}`"
                        );
                        var message = ``;
                        for (var sheet of player.sheets) {
                            message +=
                                "📄 `" +
                                sheet.sheetID +
                                "` - **" +
                                sheet.profile.name +
                                "**\n";
                        }
                        global.CHANNEL.send(message);
                    }
                }
            });
    };

    current = () => {
        mongoose
            .model("player")
            .findOne({ discordID: this.id })
            .populate("currentSheet")
            .exec((err, player) => {
                if (player.currentSheet) {
                    global.CHANNEL.send(
                        `🧟 You are currently playing as **${player.currentSheet.profile.name}**` +
                            " (`" +
                            player.currentSheet.sheetID +
                            "`)"
                    );
                } else {
                    global.CHANNEL.send(
                        "You are currently not playing as any character. Use `!trpg player playAs {id}` to select your current character!"
                    );
                }
            });
    };

    playAs = content => {
        const sheetID = content.split(" ")[3];
        mongoose
            .model("player")
            .findOne({ discordID: this.id })
            .populate("sheets")
            .populate("currentSheet")
            .exec((err, player) => {
                if (err) throw err;

                if (player) {
                    var sheet = player.sheets.find(s => s.sheetID === sheetID);
                    if (!sheet) {
                        global.CHANNEL.send(
                            `🤦‍♀️ ${sheetID} doesn't match any of your sheets! Please register that one first or try another.`
                        );
                    } else if (
                        player.currentSheet &&
                        player.currentSheet.sheetID === sheetID
                    ) {
                        global.CHANNEL.send(
                            `🧛 You are already playing as **${sheet.profile.name}**.`
                        );
                    } else {
                        player.currentSheet = sheet;
                        player.save();
                        global.CHANNEL.send(
                            `🤠 You are now playing as **${sheet.profile.name}**. Have fun!`
                        );
                    }
                }
            });
    };
}

module.exports = DiscordPlayer;
