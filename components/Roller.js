const mongoose = require("mongoose");
const Roll = require("roll");
const { prefix } = require("../config.json");

const utils = require("../utils");

const skills = [
    "combat_melee",
    "combat_ranged",
    "communication",
    "orientation",
    "stealth",
    "profiling",
    "science",
    "occult",
    "faith",
    "clearence_level"
];

const diceRoller = new Roll();

class Roller {
    static roll = (author, message) => {
        const args = message.content.slice(prefix.length + 1).split(" ");
        args.shift();
        console.log(args);

        mongoose
            .model("player")
            .findOne({ discordID: author.id })
            .populate("currentSheet")
            .exec((err, player) => {
                if (skills.includes(args[0])) {
                    // Rolling for a skill
                    Roller.skillRoll(player, args[0]);
                } else {
                    var diceRoll = diceRoller.roll(args[0]);
                    console.log(diceRoll);

                    global.CHANNEL.send(
                        `*🎲 **${player.currentSheet.profile.name}** rolled [${
                            args[0]
                        }]*\n> Result: ` +
                            "`" +
                            diceRoll.rolled +
                            "` → **" +
                            diceRoll.result +
                            "**"
                    ).then(message => {
                        // Delete user message (spam prevention)
                        message
                            .delete()
                            .then(msg =>
                                console.log(
                                    `Deleted message from ${msg.author.username}`
                                )
                            )
                            .catch(console.error);
                    });
                }
            });
    };

    static skillRoll = (player, skill) => {
        var dices = player.currentSheet.skills[skill];

        if (dices > 0) {
            var diceRoll = diceRoller.roll(`${dices}d6`);
            console.log(diceRoll);

            global.CHANNEL.send(
                `*🎲 **${
                    player.currentSheet.profile.name
                }** rolled for **${utils.formatToHuman(
                    skill
                )}** [${dices}d6]*\n> Result: ` +
                    "`" +
                    diceRoll.rolled +
                    "` → **" +
                    diceRoll.result +
                    "**"
            );
        } else {
            console.log("skillroll");

            global.CHANNEL.send(
                `*🎲 **${
                    player.currentSheet.profile.name
                }** tried to roll for **${utils.formatToHuman(
                    skill
                )}** but he/she has no dices for it! How sad...*`
            );
        }
    };
}

module.exports = Roller;
