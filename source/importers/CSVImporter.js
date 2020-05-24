const fs = require("fs");
const path = require("path");
const pify = require("pify");
const { Vault } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const readFile = pify(fs.readFile);

/**
 * Importer for CSV files
 * @memberof module:ButtercupImporter
 */
class CSVImporter {
    /**
     * Create a new CSV importer
     * @param {String} csvData The source CSV data
     * @param {String=} name Name for the imported folder
     */
    constructor(csvData, name = "Untitled CSV import") {
        this._csvData = csvData;
        this._groupName = name;
    }

    /**
     * Export to a Buttercup vault
     * @returns {Promise.<Vault>}
     * @memberof CSVImporter
     */
    export() {
        return Promise.resolve().then(() => {
            const vault = new Vault();
            const group = vault.createGroup(this._groupName);
            csvparse(this._csvData, { columns: true }).forEach(
                (item, index) => {
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
                }
            );
            return vault;
        });
    }
}

/**
 * Load CSV data from a file
 * @param {String} filename The file to read (CSV)
 * @returns {Promise.<CSVImporter>}
 * @memberof CSVImporter
 * @static
 */
CSVImporter.loadFromFile = function(filename) {
    return readFile(filename, "utf8").then(
        data => new CSVImporter(data, path.basename(filename).split(".")[0])
    );
};

module.exports = CSVImporter;
