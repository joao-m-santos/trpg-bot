const request = require("request");

const utils = require("../utils");

const Roller = require("../components/Roller");

module.exports = message => {
    Roller.roll(message.author, message);
};
