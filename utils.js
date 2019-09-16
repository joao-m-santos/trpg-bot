const fs = require("fs");

module.exports = {
    hasAttachments: message =>
        message.attachments && message.attachments.first(),
    formatToHuman: skill => {
        var formatted = skill.replace(/_/g, " ");
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        if (formatted.includes("Combat"))
            formatted =
                formatted.split(" ")[0] + ` (${formatted.split(" ")[1]})`;
        return formatted;
    }
};
