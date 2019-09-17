const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");

const utils = require("../utils");
const validator = require("./utils/validatorObject");

const Player = require("../api/schemas/player");
const Sheet = require("../api/schemas/sheet");

const DiscordPlayer = require("./DiscordPlayer");

class CharacterSheet {
    constructor(data, file, authorid) {
        this.id = authorid + "__" + file.filename + "-" + file.filesize;
        this.data = data;
        this.authorid = authorid;
    }

    register = () => {
        console.log("Registering sheet...");
        mongoose
            .model("player")
            .findOne({ discordID: this.authorid })
            .populate("sheets")
            .exec((err, player) => {
                console.log("wow", player.sheets);

                if (player.sheets.find(s => s.sheetID === this.id)) {
                    global.CHANNEL.send(`🤦‍♀️ This sheet is already registered!`);
                } else {
                    this.generateSheet(player).then(sheet => {
                        const newSheet = new Sheet(sheet);

                        newSheet.save(err => {
                            if (err) throw err;

                            global.CHANNEL.send(
                                `🌟 Your new sheet was registered successfully! To play as **${sheet.profile.name}**, type ` +
                                    "`!trpg player playAs " +
                                    sheet.sheetID +
                                    "`"
                            );

                            player.sheets.push(newSheet);
                            player.save();
                        });
                    });
                }
            });
    };

    generateSheet = player => {
        return new Promise((resolve, reject) => {
            var sheetObject = {
                player: player,
                sheetID: this.id,
                profile: {},
                status: {},
                passives: {},
                skills: {},
                lucky_shots: null
            };

            for (var index in this.data) {
                var line = this.data[index];
                if (!line.match(/---/g)) {
                    var key = line
                        .match(/(\[[\s\S]*\]:)/g)[0]
                        .replace(/[\[\]:\(\)]/g, "")
                        .replace(/ /g, "_")
                        .toLowerCase();
                    var value = line.match(/(?<=(\[[\s\S]*\]:)).*$/g)[0];
                    console.log(index + " > ", key + ":", value);
                    if (index <= 3) sheetObject.profile[key] = value;
                    else if (index <= 8) sheetObject.status[key] = value;
                    else if (index <= 13) sheetObject.passives[key] = value;
                    else if (index <= 25) sheetObject.skills[key] = value;
                    else if (index <= 28) sheetObject[key] = value;
                }
            }

            resolve(sheetObject);
        });
    };

    static export = message => {
        const sheetID = message.content.split(" ")[3];

        if (sheetID) {
            // Delete sheet by ID
            mongoose
                .model("sheet")
                .findOne({ sheetID: sheetID })
                .exec((err, sheet) => {
                    if (err) throw err;

                    if (sheet) {
                        // export
                        console.log("exporting... " + sheet.profile.name);
                        CharacterSheet.exportFunction(sheet);
                    } else {
                        global.CHANNEL.send(
                            "😕 Couldn't find that sheet for you! Are you sure you typed the right ID? Use `!trpg player listSheets` to get your sheet IDs!"
                        );
                    }
                });
        } else {
            // Delete current sheet
            const authorID = message.author.id;
            mongoose
                .model("player")
                .findOne({ discordID: `${authorID}` })
                .populate("currentSheet")
                .exec((err, player) => {
                    if (err) throw err;

                    if (player && player.currentSheet) {
                        // export
                        console.log(
                            "exporting... " + player.currentSheet.profile.name
                        );
                        CharacterSheet.exportFunction(player.currentSheet);
                    } else {
                        global.CHANNEL.send(
                            "😕 Couldn't find that sheet for you! Are you sure you typed the right ID? Use `!trpg player listSheets` to get your sheet IDs!"
                        );
                    }
                });
        }
    };

    static validate = data => {
        console.log("Validating...");
        return new Promise((resolve, reject) => {
            var isValid = true;
            var invalidMessage = "";

            for (var key of Object.keys(validator)) {
                var x = data.find(l => l.match(validator[key]));

                if (!x) {
                    isValid = false;
                    invalidMessage += `    > Field "${key}" is invalid.\n`;
                }
            }

            if (isValid) resolve("✅ Sheet is valid!");
            else reject("❌ Sheet is invalid! Reason(s):\n" + invalidMessage);
        });
    };

    static exportFunction = sheet => {
        console.log(sheet);

        const filename = `temp/${sheet.profile.name
            .toLowerCase()
            .replace(/ /g, "-")}.txt`;

        var logger = fs.createWriteStream(filename, {
            // flags: "a" // 'a' means appending (old data will be preserved)
        });

        logger.on("close", ch => {
            global.CHANNEL.send("Here's your file:", {
                files: [
                    {
                        attachment: filename,
                        name: `SNAP_Sheet_${sheet.profile.name.replace(
                            / /g,
                            "-"
                        )}.txt`
                    }
                ]
            }).then(message => {
                console.log(message);
            });
        });

        logger.write("---");
        logger.write("--- Profile");

        for (var key of Object.keys(sheet.profile)) {
            console.log(`[${utils.formatToHuman(key)}]:` + sheet.profile[key]);
            logger.write(`[${utils.formatToHuman(key)}]:` + sheet.profile[key]);
        }

        // logger.write("more data");
        // logger.write("and more");

        logger.end();
    };
}

module.exports = CharacterSheet;
