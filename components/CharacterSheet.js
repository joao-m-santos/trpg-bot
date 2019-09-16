const mongoose = require("mongoose");

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
}

module.exports = CharacterSheet;
