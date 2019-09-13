const request = require("request");

const utils = require("../utils");
const errors = require("../errors");

const Player = require("../components/Player");

module.exports = (action, message) => {
    commands[action](message);
};

const commands = {
    register: message => {
        const player = new Player(message.author);
        player.register();
    }
};
