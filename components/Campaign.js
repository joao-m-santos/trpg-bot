const mongoose = require("mongoose");
const Cp = require("../api/schemas/campaign");
const { prefix } = require("../config.json");

const utils = require("../utils");

class Campaign {
    static start = message => {
        const args = message.content.slice(prefix.length + 1).split(" ");
        args.shift();
        args.shift();
        const campaignName = args.join(" ");
        console.log(campaignName);

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
        const args = message.content.slice(prefix.length + 1).split(" ");
        args.shift();
        args.shift();
        const campaignName = args.join(" ");
        console.log(campaignName);

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
}

module.exports = Campaign;
