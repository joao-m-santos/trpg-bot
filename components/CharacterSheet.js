const utils = require("../utils");
const validator = require("./utils/validatorObject");
const Player = require("./Player");

class CharacterSheet {
    constructor(data, author) {
        this.id =
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15);
        this.data = data;
        this.player = new Player(author);
    }

    register = () => {
        this.player.getSheets().then(sheets => {
            console.log("Sheets: ", sheets);
            if (sheets.find(s => s.id === this.id)) {
                global.CHANNEL.send(`🤦‍♀️ This sheet is already registered!`);
            } else {
                utils.getPlayers(players => {
                    this.generateJSONSheet();
                    // players.find(p => p.id === this.player.id).sheets.push(
                    //     this.generateJSONSheet()
                    // );
                    // utils.updatePlayers(players, () => {
                    //     global.CHANNEL.send(`Your sheet was successfully registered!`);
                    // });
                });
            }
        });
    };

    generateJSONSheet = () => {
        var sheetObject = {
            passive: {},
            skills: {}
        };

        for (var index in this.data) {
            var line = this.data[index];
            if (!line.match(/---/g)) {
                var key = line
                    .match(/(\[[\s\S]*\]:)/g)[0]
                    .replace(/[\[\]:\(\)]/g, "")
                    .replace(/ /g, "_")
                    .toLowerCase();
                var value = line.match(/(?<=(\[[\s\S]*\]:)).*$/g)[0];
                console.log(index + " > ", key + ":", value);
                if (index <= 7) sheetObject[key] = value;
                else if (index <= 12) sheetObject.passive[key] = value;
                else if (index <= 24) sheetObject.skills[key] = value;
                else if (index <= 27) sheetObject[key] = value;
            }
        }

        console.log("Sheet: ", sheetObject);
    };

    static validate = data => {
        console.log("Validating...");
        return new Promise((resolve, reject) => {
            var isValid = true;
            var invalidMessage = "";

            for (var key of Object.keys(validator)) {
                var x = data.find(l => l.match(validator[key]));

                if (!x) {
                    isValid = false;
                    invalidMessage += `    > Field "${key}" is invalid.\n`;
                }
            }

            if (isValid) resolve("Sheet is valid!");
            else reject("Sheet is invalid! Reason(s):\n" + invalidMessage);
        });
    };
}

module.exports = CharacterSheet;
