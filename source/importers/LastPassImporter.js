const fs = require("fs");
const pify = require("pify");
const { Vault } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const DEFAULT_GROUP = "General";

const readFile = pify(fs.readFile);

class LastPassImporter {
    constructor(filename) {
        this._filename = filename;
    }

    export() {
        const groups = {};
        return readFile(this._filename, "utf8").then(contents => {
            const vault = new Vault();
            csvparse(contents, { columns: true }).forEach(lastpassItem => {
                const groupName = lastpassItem.grouping || DEFAULT_GROUP;
                const group =
                    groups[groupName] ||
                    (groups[groupName] = vault.createGroup(groupName));
                const entry = group
                    .createEntry(lastpassItem.name)
                    .setProperty("username", lastpassItem.username)
                    .setProperty("password", lastpassItem.password)
                    .setProperty("URL", lastpassItem.url);
                if (lastpassItem.extra) {
                    entry.setProperty("Notes", lastpassItem.extra);
                }
            });
            return vault;
        });
    }
}

module.exports = LastPassImporter;
