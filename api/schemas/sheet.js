const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var sheetSchema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: "player" },
    sheetID: String,
    profile: {
        name: String,
        bio: String
    },
    status: {
        health: String,
        sanity: Number,
        initiative: Number
    },
    passives: {
        endurance: Number,
        wits: Number,
        speed: Number
    },
    skills: {
        combat_melee: Number,
        combat_ranged: Number,
        communication: Number,
        orientation: Number,
        stealth: Number,
        profiling: Number,
        science: Number,
        occult: Number,
        faith: Number,
        clearence_level: Number
    },
    lucky_shots: Number
});

module.exports = mongoose.model("sheet", sheetSchema);
