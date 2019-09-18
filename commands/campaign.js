const request = require("request");
const Campaign = require("../components/Campaign");

const utils = require("../utils");

module.exports = (action, message) => {
    commands[action](message);
};

const commands = {
    start: message => {
        Campaign.start(message);
    },
    end: message => {
        Campaign.end(message);
    }
};
