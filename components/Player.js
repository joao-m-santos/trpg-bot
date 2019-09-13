const utils = require("../utils");
const errors = require("../errors");

class Player {
    constructor(author) {
        this.id = author.id;
        this.name = author.username;
    }

    register = () => {
        utils.getPlayers(players => {
            console.log("Players: ", players);
            const player = players.find(p => p.id === this.id);
            if (player) {
                global.CHANNEL.send(`🤦‍♀️ You're already registered!`);
                if (player.sheets && player.sheets.length > 0)
                    global.CHANNEL.send(
                        `You even have like ${player.sheets.length - 1} or ${
                            player.sheets.length
                        } sheets!`
                    );
                else
                    global.CHANNEL.send(
                        "You still don't have any sheets thought. Register one by uploading a .txt file with the command `!trpg sheet register`"
                    );
            } else {
                players.push({
                    id: this.id,
                    name: this.name,
                    sheets: []
                });
                utils.updatePlayers(JSON.stringify(players), updatedPlayers => {
                    console.log("updatedPlayers: ", updatedPlayers);
                    global.CHANNEL.send(
                        "🌟 You've been registered as a Player! Register your first sheet by uploading a .txt file with the command `!trpg sheet register`"
                    );
                });
            }
        });
    };

    getSheets = () => {
        return new Promise((resolve, reject) => {
            utils.getPlayer(this.id, player => {
                resolve(player.sheets);
            });
        });
    };
}

module.exports = Player;
