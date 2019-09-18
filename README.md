# TRPG Bot

TRPG Bot is a **t**ext-based **r**ole-**p**laying **g**ame helper Discord Bot made to streamline [SNAP](mailto:guilherme0portela@gmail.com) gameplay, fully developed in Node.js.

### Table of contents

-   [Features](#features)
-   [How to use](#how-to-use)
    -   [Setup](#setup)
    -   [Gameplay](#gameplay)
-   [API](#api)
-   [Built with](#built-with)
-   [For developers](#for-developers)

## Features

TRPG Bot provides several features that enhance [SNAP](mailto:guilherme0portela@gmail.com) gameplay:

-   Automated character sheet management and updates
-   Custom dice roll functions

## How to use

### Setup

**1.  Register yourself as a Player**\
    Simply run `!trpg player register`

**2.  Register a Character sheet**\
    Upload a Character sheet .txt file and type the command `!trpg sheet register`.
    Important: The file must follow the [SNAP Character sheet template](https://github.com/joao-m-santos/trpg-bot/blob/master/sample_sheet.txt)

**3.  Select your current sheet**\
    Now you can select your current sheet by typing `!trpg player playAs {id}`, where {id} is your desired sheet ID. If you don't know your sheet ID, run `!trpg player listSheets`, and you'll be able to see all your registered sheets and their IDs.

### Gameplay

#### Dice rolls

In [SNAP](mailto:guilherme0portela@gmail.com), you can attempt to use a Skill you have dice on, or you might be asked to do a plain dice roll.
When you want to use a Skill, type `!trpg roll {skill_name}`, where {skill_name} is the Skill you are attempting. For example:

`!trpg roll combat_melee`

> **John Doe** rolled for **Combat (melee)** [4d6]\
> Result: `4,3,5,3` → **15**

## API

### Sheet

| Command                | Arguments                      | Description                                |
| ---------------------- | ------------------------------ | ------------------------------------------ |
| `!trpg sheet register` | File (attachment) _[Required]_ | Registers a Character sheet to your Player |

### Player

| Command                          | Arguments                                     | Description                                                    | Example                                                     |
| -------------------------------- | --------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| `!trpg player register`          | --                                            | Registers yourself as a Player                                 |
| `!trpg player listSheets`        | --                                            | Displays your registered Character sheets                      |
| `!trpg player current`           | --                                            | Displays your current Character sheet (Who you are playing as) |
| `!trpg player playAs {sheet_id}` | sheet_id - The desired sheet ID *[Required]* | Updates your current Character sheet                           | `!trpg player playAs 274662764792774656__charsheet.txt-387` |

### Dungeon Master

| Command                | Arguments                      | Description                                | Example   |
| ---------------------- | ------------------------------ | ------------------------------------------ | ----------|
| `!trpg dm register`    | --                             | Registers yourself as a Dungeon Master     |           |
| `!trpg dm start campaign {campaign_name}` | campaign_name - The name of your Campaign | Creates a new Campaign | `!trpg dm start campaign A wonderful adventure` |
| `!trpg dm listCampaigns`        | --      | Displays your registered Campaigns |  |
| `!trpg dm current`        | --      | Displays the current Campaign you're playing in |  |
| `!trpg dm playIn {campaign_name}`        | campaign_name - The name of your Campaign | Updates the current Campaign you're playing in | `!trpg dm playIn A wonderful adventure` |

### Roll

| Command                     | Arguments                                                                     | Description                                   | Example                                         |
| --------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| `!trpg roll {skill / dice}` | skill - The skill you want to roll for <br> dice - The amount of dice to roll <br> *[Required]* | Rolls dice for a Skill or the amount provided | `!trpg roll combat_melee` <br> `!trpg roll 2d6` |

### Campaign

| Command | Arguments | Description | Example |
| ------- | --------- | ----------- | ------- |
| `!trpg campaign start {campaign_name}` | campaign_name - The name for the new campaign *[Required]* | Starts a new campaign with the given name | `!trpg campaign start A wonderful adventure` |
| `!trpg campaign end {campaign_name}` | campaign_name - The name of the campaign to end *[Required]* | Ends the campaign | `!trpg campaign end A wonderful adventure` |
| `!trpg campaign getLogs {campaign_name}` | campaign_name - The name of the campaign to get the logs from *[Required]* | Exports a file with the entire campaign's logs | `!trpg campaign getLogs A wonderful adventure` |

### Skills

| Name            | Code            |
| --------------- | --------------- |
| Combat (Melee)  | combat_melee    |
| Combat (Ranged) | combat_ranged   |
| Communication   | communication   |
| Orientation     | orientation     |
| Stealth         | stealth         |
| Profiling       | profiling       |
| Science         | science         |
| Occult          | occult          |
| Faith           | faith           |
| Clearence Level | clearence_level |

## Built with

This project currently uses:

-   [Node.js](https://nodejs.org/)
    -   [Mongoose](https://mongoosejs.com/) (MongoDB)
    -   [discord.js](https://discord.js.org/)

## For developers

This is a simple guide for developers who want to contribute new features to this bot.

### Prerequistes

-   Node.js
-   npm

### Installation

1.  Clone the repository:
    `git clone https://github.com/joao-m-santos/trpg-bot.git`

2.  Move to the project directory:
    `cd trpg-bot`

3.  Install the node packages:
    `npm install`

4.  Create a `private-config.json` file:
    `touch private-config.json`

5.  Add your Discord token and your MongoDB connection string to your `private-config.json` file:
    ```json
        {
            "dbString": "mongodb-connection-string",
            "token": "your-token"
        }
    ```

### Contributing

In order to contribute to the project, please follow these steps:

1.  Fork the project
2.  Create your feature branch (git checkout -b feature/amazing-feature)
3.  Commit your changes (git commit -m 'Add some amazing feature')
4.  Push to the branch (git push origin feature/amazing-feature)
5.  Open a pull request

## Contact

[Joao Santos](https://joao-m-santos.github.io/) - [jm_santos7@hotmail.com](mailto:jm_santos7@hotmail.com)

***

Made with ❤ by [Joao](https://joao-m-santos.github.io/)
