const { sheetTemplate } = require("./config.json");

module.exports = {
    serverError: channel => {
        channel.send(
            `\:poop: There was an error getting the file you uploaded! It's probably a Discord issue. Please try again in a while.`
        );
    },
    noAttachment: channel => {
        channel.send(
            `\:poop: **No attachment found!** Please attach a Character sheet text file and try again. *(You can find the template at ${sheetTemplate})*`
        );
    }
};
