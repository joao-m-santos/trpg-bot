const request = require("request");

const utils = require("../utils");

module.exports = message => {
    var returnText = "";

    returnText +=
        "👋 Hi, I'm TRPG, a helper Discord Bot made to streamline SNAP gameplay.\n\n";

    returnText += "Here's a list of the available commands:\n";

    // Generic
    returnText +=
        "```!trpg help                            Shows a list of available commands and how to use them```\n";

    // Player
    returnText +=
        "```!trpg player register                 Register yourself as a Player```";
    returnText +=
        "```!trpg player listSheets               Displays your registered Character sheets```";
    returnText +=
        "```!trpg player current                  Displays your current Character sheet (Who you are playing as)```";
    returnText +=
        "```!trpg player playAs {sheet_id}        Updates your current Character sheet```\n";

    // Character Sheet
    returnText +=
        "```!trpg sheet register                  Registers a Character sheet to your Player (needs an attachment)```";

    // Roll
    returnText +=
        "```!trpg roll {skill / dice}             Rolls dice for a Skill or the amount provided```";

    global.CHANNEL.send(returnText);
};
