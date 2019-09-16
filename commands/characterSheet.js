const request = require("request");

const utils = require("../utils");
const errors = require("../errors");

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
                            const cs = new CharacterSheet(fileData, file, author.id);
                            cs.register();
                        })
                        .catch(err => {
                            message.channel.send(err);
                        });
                } else {
                    errors.serverError(message.channel);
                }
            });
        } else {
            errors.noAttachment(message.channel);
        }
    }
};
