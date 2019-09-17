const Discord = require("discord.js");
const mongoose = require("mongoose");

const { prefix } = require("./config.json");
const { token } = require("./private-config.json");
const utils = require("./utils");

const client = new Discord.Client();

const Player = require("./api/schemas/player");
const Sheet = require("./api/schemas/sheet");

const sheetFunction = require("./commands/characterSheet");
const playerFunction = require("./commands/player");
const rollFunction = require("./commands/roll");
const helpFunction = require("./commands/help");

const isCommand = msg => (msg.match(/^!trpg .*$/g) ? true : false);

client.once("ready", () => {
    console.log("Ready!");

    const database = require("./api/connection");
    database(db => {});

    global.CHANNEL = client.channels.find(ch => ch.name === "general");
});

client.login(token);

client.on("message", message => {
    if (message.author.bot) return;

    const msgBody = message.content.trim();
    if (isCommand(msgBody)) {
        const commandType = msgBody.split(" ")[1];
        const commandAction = msgBody.split(" ")[2];

        console.log(
            "Command type: " + commandType,
            "Command action: " + commandAction
        );

        switch (commandType) {
            case "sheet":
                sheetFunction(commandAction, message);
                break;
            case "player":
                playerFunction(commandAction, message);
                break;
            case "roll":
                rollFunction(message);
                break;
            case "help":
                helpFunction(message);
                break;
            default:
                global.CHANNEL.send(
                    "😿 That command isn't recognized by me... Maybe use `!trpg help` to see what I can do!"
                );
                break;
        }
    }
});
