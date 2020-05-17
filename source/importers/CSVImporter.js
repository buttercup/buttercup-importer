const fs = require("fs");
const path = require("path");
const pify = require("pify");

const { Vault } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

/**
 * Import CSV vaults from from Chrome/Chromium/Google/Opera and from
 *  other popular browsers
 * @param {String} vaultCSVPath
 * @returns {Promise.<Vault>}
 */
const importFromCSV = (vaultCSVPath) => {
    const groupName = path.basename(vaultCSVPath).split(".")[0];
    return pify(fs.readFile)(vaultCSVPath, "utf8").then((contents) => {
        const vault = new Vault();
        const group = vault.createGroup(groupName);
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
                entry.setProperty("URL", item.url);
            }
        });
        return vault;
    });
};

module.exports = importFromCSV;
