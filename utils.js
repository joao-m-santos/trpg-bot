const fs = require("fs");

module.exports = {
    hasAttachments: message =>
        message.attachments && message.attachments.first(),
    getPlayers: callback => {
        fs.readFile("players.json", "utf8", (err, data) => {
            if (err) throw err; // we'll not consider error handling for now
            callback && callback(JSON.parse(data));
        });
    },
    getPlayer: (id, callback) => {
        fs.readFile("players.json", "utf8", (err, data) => {
            if (err) throw err;
            const player = JSON.parse(data).find(p => p.id === id);
            callback && callback(player);
        });
    },
    updatePlayers: (newPlayers, callback) => {
        fs.writeFile("players.json", newPlayers, function(err) {
            if (err) throw err;
            callback && callback(JSON.parse(newPlayers));
        });
    }
};
