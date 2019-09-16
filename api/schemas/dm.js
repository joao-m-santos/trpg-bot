const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var dmSchema = new Schema({
    name: String,
    discordID: String,
    campaigns: [{ type: Schema.Types.ObjectId, ref: "campaign" }],
    currentCampaign: { type: Schema.Types.ObjectId, ref: "campaign" }
});

module.exports = mongoose.model("dm", dmSchema);
