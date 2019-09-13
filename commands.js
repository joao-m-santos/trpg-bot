const sheetFunction = require("./commands/characterSheet");
const playerFunction = require("./commands/player");

module.exports = {
    sheets: (action, message) => sheetFunction(action, message),
    player: (action, message) => playerFunction(action, message)
};
