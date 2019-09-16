const request = require("request");

const utils = require("../utils");
const errors = require("../errors");

const Roller = require("../components/Roller");

module.exports = message => {
    Roller.roll(message.author, message);
};
