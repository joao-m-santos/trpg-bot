const mongoose = require("mongoose");
const Dm = require("../api/schemas/dm");
const Campaign = require("../api/schemas/campaign");

const { prefix } = require("../config.json");
const utils = require("../utils");

class DungeonMaster {
    constructor(author) {
        this.id = author.id.toString(10);
        this.name = author.username;
    }

    register = () => {
        mongoose.model("dm").findOne({ discordID: this.id }, (err, master) => {
            if (err) throw err;

            if (master) {
                global.CHANNEL.send(`🤦‍♀️ You're already registered!`);
            } else {
                const newDm = new Dm({
                    _id: new mongoose.Types.ObjectId(),
                    name: this.name,
                    discordID: this.id,
                    campaigns: [],
                    currentCampaign: null
                });
                newDm.save(err => {
                    if (err) throw err;

                    global.CHANNEL.send(
                        "🌟 You've been registered as a Dungeon Master! Start your first Campaign by typing `!trpg dm start campaign`"
                    );
                });
            }
        });
    };

    start = content => {
        const args = content.slice(prefix.length + 1).split(" ");
        args.shift();
        console.log(args);
        const type = args[1];
        const name = args.splice(2, args.length).join(" ");

        if (type && name && name.trim() !== "") {
            switch (type) {
                case "campaign":
                    this.startCampaign(name);
                    break;
                default:
                    break;
            }
        } else {
            global.CHANNEL.send(
                "❌ Format is invalid! Please check the syntax of your command."
            );
        }
    };

    startCampaign = name => {
        console.log(name);

        mongoose.model("dm").findOne({ discordID: this.id }, (err, master) => {
            if (err) throw err;

            mongoose
                .model("campaign")
                .findOne({ name: name }, (err, campaign) => {
                    if (err) throw err;

                    if (campaign) {
                        global.CHANNEL.send(
                            "❌ There is already a Campaign with that name! Please use a different name."
                        );
                    } else {
                        const newCampaign = new Campaign({
                            _id: new mongoose.Types.ObjectId(),
                            name: name,
                            players: [],
                            dm: master
                        });

                        master.campaigns.push(newCampaign);
                        master.save();

                        newCampaign.save(err => {
                            if (err) throw err;

                            global.CHANNEL.send(
                                `📖 You created a new Campaign, **"${name}"**! It was automatically set as your current. Add players by their Discord names with the following command ` +
                                    "`!trpg campaign add players {player_name} {player_name}`"
                            );
                        });
                    }
                });
        });
    };

    listCampaigns = () => {
        mongoose
            .model("dm")
            .findOne({ discordID: this.id })
            .populate("campaigns")
            .populate("currentCampaign")
            .exec((err, master) => {
                if (err) throw err;

                if (master) {
                    if (master.currentCampaign) {
                        global.CHANNEL.send(
                            `You are currently playing as **${master.currentCampaign.name}**.`
                        );
                    }

                    global.CHANNEL.send(
                        "Here are your available Campaigns. Select a Campaign to play in by typing `!trpg dm playIn {campaign_name}`"
                    );
                    var message = ``;
                    for (var campaign of master.campaigns) {
                        message += "📕 **" + campaign.name + "**\n";
                    }
                    global.CHANNEL.send(message);
                }
            });
    };

    current = () => {
        mongoose
            .model("dm")
            .findOne({ discordID: this.id })
            .populate("currentCampaign")
            .exec((err, master) => {
                if (master.currentCampaign) {
                    global.CHANNEL.send(
                        `🧟 You are currently playing in **${master.currentCampaign.name}**`
                    );
                } else {
                    global.CHANNEL.send(
                        "You are currently not playing in any Campaign. Use `!trpg dm playIn {campaign_name}` to select your current Campaign!"
                    );
                }
            });
    };

    playIn = content => {
        const args = content.slice(prefix.length + 1).split(" ");
        args.shift();
        console.log(args);
        const name = args.splice(1, args.length).join(" ");

        mongoose
            .model("dm")
            .findOne({ discordID: this.id })
            .populate("campaigns")
            .populate("currentCampaign")
            .exec((err, master) => {
                if (err) throw err;

                if (master) {
                    var campaign = master.campaigns.find(c => c.name === name);
                    if (!campaign) {
                        global.CHANNEL.send(
                            `🤦‍♀️ ${name} doesn't match any of your Campaigns! Please create that one first or try another.`
                        );
                    } else if (
                        master.currentCampaign &&
                        master.currentCampaign.name === name
                    ) {
                        global.CHANNEL.send(
                            `📘 You are already playing in **${campaign.name}**.`
                        );
                    } else {
                        master.currentCampaign = campaign;
                        master.save();
                        global.CHANNEL.send(
                            `📖 You are now playing in **${campaign.name}**. Have fun!`
                        );
                    }
                }
            });
    };
}

module.exports = DungeonMaster;
