const fs = require("fs");
const pify = require("pify");
const { Group, Vault } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const NON_COPY_KEYS = ["id", "title"];
const ROOT_GROUP_ID = "0";

const readFile = pify(fs.readFile);

/**
 * Importer for Buttercup CSV exports
 * @memberof module:ButtercupImporter
 */
class ButtercupCSVImporter {
    /**
     * Create a new Buttercup CSV importer
     * @param {String} csvData Raw CSV data of a Buttercup vault export
     */
    constructor(csvData) {
        this._csvData = csvData;
    }

    /**
     * Export to a Buttercup vault
     * @returns {Promise.<Vault>}
     * @memberof ButtercupCSVImporter
     */
    export() {
        return Promise.resolve().then(() => {
            const vault = new Vault();
            csvparse(this._csvData, { columns: true }).forEach(bcupItem => {
                const {
                    ["!group_id"]: groupID,
                    ["!group_name"]: groupName
                } = bcupItem;
                let group = vault.findGroupByID(groupID);
                if (!group) {
                    group = Group.createNew(vault, ROOT_GROUP_ID, groupID);
                }
                group.setTitle(groupName);
                const entry = group.createEntry(bcupItem.title);
                Object.keys(bcupItem)
                    .filter(key => /^\!.+/.test(key) === false)
                    .filter(key => NON_COPY_KEYS.indexOf(key) === -1)
                    .forEach(key => {
                        entry.setProperty(key, bcupItem[key]);
                    });
            });
            return vault;
        });
    }
}

/**
 * Load CSV data from a file
 * @param {String} filename The file to read (CSV)
 * @returns {Promise.<ButtercupCSVImporter>}
 * @memberof ButtercupCSVImporter
 * @static
 */
ButtercupCSVImporter.loadFromFile = function(filename) {
    return readFile(filename, "utf8").then(
        data => new ButtercupCSVImporter(data)
    );
};

module.exports = ButtercupCSVImporter;
