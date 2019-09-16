const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var playerSchema = new Schema({
    name: String,
    discordID: String,
    sheets: [{ type: Schema.Types.ObjectId, ref: "sheet" }],
    currentSheet: { type: Schema.Types.ObjectId, ref: "sheet" }
});

module.exports = mongoose.model("player", playerSchema);
