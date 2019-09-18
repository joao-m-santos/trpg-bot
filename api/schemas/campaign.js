const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var campaignSchema = new Schema({
    name: String,
    startDate: Date,
    startMessage: String,
    endDate: Date,
    endMessage: String
});

module.exports = mongoose.model("campaign", campaignSchema);
