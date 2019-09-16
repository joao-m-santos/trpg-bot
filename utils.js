const fs = require("fs");

module.exports = {
    hasAttachments: message =>
        message.attachments && message.attachments.first(),
};
