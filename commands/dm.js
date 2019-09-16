const request = require("request");

const utils = require("../utils");

const DungeonMaster = require("../components/DungeonMaster");

module.exports = (action, message) => {
    commands[action](message);
};

const commands = {
    register: message => {
        const master = new DungeonMaster(message.author);
        master.register();
    },
    start: message => {
        const master = new DungeonMaster(message.author);
        master.start(message.content);
    },
    listCampaigns: message => {
        const master = new DungeonMaster(message.author);
        master.listCampaigns();
    },
    current: message => {
        const master = new DungeonMaster(message.author);
        master.current();
    },
    playIn: message => {
        const master = new DungeonMaster(message.author);
        master.playIn(message.content);
    }
};
