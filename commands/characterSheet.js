const request = require("request");

const utils = require("../utils");
const { sheetTemplate } = require("../config.json");

const CharacterSheet = require("../components/CharacterSheet");

module.exports = (action, message) => {
    commands[action](message);
};

const commands = {
    register: message => {
        if (utils.hasAttachments(message)) {
            const author = message.author;
            let file = message.attachments.first();
            console.log(file);

            request.get(file.url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const fileData = body.split(/\r?\n/);

                    CharacterSheet.validate(fileData)
                        .then(res => {
                            message.channel.send(res);
                            const cs = new CharacterSheet(
                                fileData,
                                file,
                                author.id
                            );
                            cs.register();
                        })
                        .catch(err => {
                            message.channel.send(err);
                        });
                } else {
                    global.CHANNEL.send(
                        `\:poop: There was an error getting the file you uploaded! It's probably a Discord issue. Please try again in a while.`
                    );
                }
            });
        } else {
            global.CHANNEL.send(
                `\:poop: **No attachment found!** Please attach a Character sheet text file and try again. *(You can find the template at ${sheetTemplate})*`
            );
        }
    }
};
