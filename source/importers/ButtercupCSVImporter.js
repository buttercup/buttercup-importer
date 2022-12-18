const fs = require("fs/promises");
const { Group, Vault } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const NON_COPY_KEYS = ["id", "title"];

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
            csvparse(this._csvData, { columns: true }).forEach((bcupItem) => {
                const {
                    ["!type"]: itemType,
                    ["!group_id"]: groupID,
                    ["!group_name"]: groupName,
                    ["!group_parent"]: groupParentID,
                } = bcupItem;
                let group = vault.findGroupByID(groupID);
                if (itemType === "group") {
                    if (!group) {
                        group = Group.createNew(vault, groupParentID, groupID);
                    }
                    group.setTitle(groupName);
                } else if (itemType === "entry") {
                    if (!group) {
                        throw new Error(
                            `No group found for entry import: ${groupID}`
                        );
                    }
                    const entry = group.createEntry(bcupItem.title);
                    Object.keys(bcupItem)
                        .filter((key) => /^\!.+/.test(key) === false)
                        .filter((key) => NON_COPY_KEYS.indexOf(key) === -1)
                        .filter((key) => bcupItem[key])
                        .forEach((key) => {
                            entry.setProperty(key, bcupItem[key]);
                        });
                } else {
                    throw new Error(
                        `Unrecognised item type in import: ${itemType}`
                    );
                }
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
ButtercupCSVImporter.loadFromFile = function (filename) {
    return fs
        .readFile(filename, "utf8")
        .then((data) => new ButtercupCSVImporter(data));
};

module.exports = ButtercupCSVImporter;
