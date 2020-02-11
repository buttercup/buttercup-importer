const fs = require("fs");
const path = require("path");
const pify = require("pify");
const os = require("os");

const { Archive } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

/**
 * Import csv archive from Chrome/Chromium/Google/Opera and from other popular browsers
 * @param {string} archiveCSVPath
 */
const importFromCSV = archiveCSVPath => {
    const groupName = path.basename(archiveCSVPath).split(".")[0];
    return pify(fs.readFile)(archiveCSVPath, "utf8").then(contents => {
        const archive = new Archive();
        const group = archive.createGroup(groupName);
        csvparse(contents, { columns: true }).forEach((item, index) => {
            const entry = group.createEntry(
                item.name || item.title || item.url || `Entry ${index}`
            );
            if (item.username) {
                entry.setProperty("username", item.username);
            }
            if (item.password) {
                entry.setProperty("password", item.password);
            }
            if (item.url) {
                entry.setMeta("url", item.url);
            }
        });

        return archive;
    });
};

module.exports = importFromCSV;
