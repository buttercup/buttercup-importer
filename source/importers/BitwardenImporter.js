const fs = require("fs");
const pify = require("pify");
const { Vault } = require("buttercup");

const readFile = pify(fs.readFile);

const DEFAULT_GROUP = "General";

/**
 * Importer for Bitwarden vaults
 * @memberof module:ButtercupImporter
 */
class BitwardenImporter {
    /**
     * Create a new Bitwarden importer
     * @param {String} data Raw JSON data of a Bitwarden vault export
     */
    constructor(data) {
        this._data = data;
    }

    /**
     * Export to a Buttercup vault
     * @returns {Promise.<Vault>}
     * @memberof BitwardenImporter
     */
    export() {
        const groups = {};
        return Promise.resolve().then(() => {
            const vault = new Vault();
            const bwJson = JSON.parse(this._data);

            // Create mapping between folder ids and groups
            groups[null] = vault.createGroup(DEFAULT_GROUP);
            bwJson.folders.forEach(bitwardenFolder => {
                if (bitwardenFolder.name == "General") {
                    groups[bitwardenFolder.id] = groups[null];
                } else {
                    groups[bitwardenFolder.id] = vault.createGroup(
                        bitwardenFolder.name
                    );
                }
            });

            bwJson.items.forEach(bitwardenItem => {
                const group = groups[bitwardenItem.folderId];

                const entry = group.createEntry(bitwardenItem.name);

                if ("login" in bitwardenItem) {
                    entry.setProperty("username", bitwardenItem.login.username);
                    entry.setProperty("password", bitwardenItem.login.password);

                    if (
                        "uris" in bitwardenItem.login &&
                        bitwardenItem.login.uris.length > 0
                    ) {
                        entry.setProperty(
                            "URL",
                            bitwardenItem.login.uris[0].uri
                        );
                    }
                }

                if ("notes" in bitwardenItem) {
                    entry.setProperty("Notes", bitwardenItem.notes);
                }

                if ("fields" in bitwardenItem) {
                    bitwardenItem.fields.forEach(itemField => {
                        entry.setProperty(itemField.name, itemField.value);
                    });
                }
            });

            return vault;
        });
    }
}

/**
 * Load an importer from a file
 * @param {String} filename The file to load from
 * @returns {Promise.<BitwardenImporter>}
 * @static
 * @memberof BitwardenImporter
 */
BitwardenImporter.loadFromFile = function(filename) {
    return readFile(filename, "utf8").then(data => new BitwardenImporter(data));
};

module.exports = BitwardenImporter;
