const request = require("request");

const utils = require("../utils");
const errors = require("../errors");

const DiscordPlayer = require("../components/DiscordPlayer");

module.exports = (action, message) => {
    commands[action](message);
};

const commands = {
    register: message => {
        const player = new DiscordPlayer(message.author);
        player.register();
    },
    listSheets: message => {
        const player = new DiscordPlayer(message.author);
        player.listSheets();
    },
    current: message => {
        const player = new DiscordPlayer(message.author);
        player.current();
    },
    playAs: message => {
        const player = new DiscordPlayer(message.author);
        player.playAs(message.content);
    }
};
