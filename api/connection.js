const mongoose = require("mongoose");
const chalk = require("chalk");
const { dbString } = require("../private-config.json");

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

module.exports = callback => {
    console.log("Initializing database connection...");
    mongoose.connect(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var db = mongoose.connection;

    db.on("connected", () => {
        console.log(
            connected("Mongoose default connection is open to ", dbString)
        );
        callback && callback(db);
    });

    db.on("error", err => {
        console.log(
            error("Mongoose default connection has occured " + err + " error")
        );
    });

    db.on("disconnected", () => {
        console.log(
            disconnected("Mongoose default connection is disconnected")
        );
    });

    process.on("SIGINT", () => {
        db.close(() => {
            console.log(
                termination(
                    "Mongoose default connection is disconnected due to application termination"
                )
            );
            process.exit(0);
        });
    });
};
