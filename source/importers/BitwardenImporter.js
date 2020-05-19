const fs = require("fs");
const pify = require("pify");
const { Vault } = require("buttercup");

const DEFAULT_GROUP = "General";

class BitwardenImporter {
    constructor(filename) {
        this._filename = filename;
    }

    export() {
        const groups = {};
        return pify(fs.readFile)(this._filename, "utf8").then(contents => {
            const vault = new Vault();
            const bwJson = JSON.parse(contents);

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

module.exports = BitwardenImporter;
