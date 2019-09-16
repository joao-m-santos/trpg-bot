const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var campaignSchema = new Schema({
    name: String,
    players: [{ type: Schema.Types.ObjectId, ref: "player" }],
    dm: { type: Schema.Types.ObjectId, ref: "dm" }
});

module.exports = mongoose.model("campaign", campaignSchema);
