const fs = require("fs");
const pify = require("pify");
const { Vault } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const readFile = pify(fs.readFile);

const DEFAULT_GROUP = "General";

/**
 * Importer for LastPass CSV dumps
 * @memberof module:ButtercupImporter
 */
class LastPassImporter {
    /**
     * Create a new LastPass importer
     * @param {String} data Raw CSV data of a LastPass vault export
     */
    constructor(data) {
        this._data = data;
    }

    /**
     * Export to a Buttercup vault
     * @returns {Promise.<Vault>}
     * @memberof LastPassImporter
     */
    export() {
        const groups = {};
        return Promise.resolve().then(() => {
            const vault = new Vault();
            csvparse(this._data, { columns: true }).forEach(lastpassItem => {
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

/**
 * Load the importer from a file
 * @param {String} filename The source filename
 * @returns {Promise.<LastPassImporter>}
 * @static
 * @memberof LastPassImporter
 */
LastPassImporter.loadFromFile = function(filename) {
    return readFile(filename, "utf8").then(contents => {
        return new LastPassImporter(contents);
    });
};

module.exports = LastPassImporter;
