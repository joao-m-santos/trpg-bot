const Discord = require("discord.js");
const fs = require("fs");
const readline = require("readline");
const https = require("https");
const request = require("request");

const utils = require("./utils");

const client = new Discord.Client();

const _token = "NjIxNjM0MTEzOTI4OTUzODU3.XXoMzw.slmo2ynijuEPmhcGF3TGM4Jp0MQ";

const _charsheetExample = "https://github.com/joao-m-santos/trpg-bot/";

client.once("ready", () => {
    console.log("Ready!");
});

client.login(_token);

client.on("message", message => {
    if (
        message.attachments &&
        message.content.trim() === "!trpg register-sheet"
    ) {
        // if (message.attachments) {
        const author = message.author;
        console.log(author);
        let file = message.attachments.first();
        request.get(file.url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                const fileData = body.split(/\r?\n/);
            } else {
                console.log(error);
            }
        });
    } else {
        _send(
            message.channel,
            `*No attachment found!* Please attach a Character sheet text file and try again. _(You can find the template at ${_charsheetExample})_`
        );
    }
    // if (message.content.includes("!what")) {
    //     message.channel.send("Today we're playing Portela's SNAP.");
    // }
    // if (message.attachments) {
    //     for (var key in message.attachments) {
    //         let attachment = message.attachments[key];
    //         console.log(attachment);
    //     }
    // }
});
