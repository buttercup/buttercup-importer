const fs = require("fs");

const pify = require("pify");
const { Archive } = require("buttercup");

const defaultGroup = "General";

/**
 * Import an exported Bitwarden JSON archive
 * @param {String} bwJsonPath The path to the Bitwarden JSON file
 * @returns {Promise.<Archive>} A promise that resolves with the imported archive
 */
const importFromBitwarden = bwJsonPath => {
    const groups = {};

    return pify(fs.readFile)(bwJsonPath, "utf8").then(contents => {
        const archive = new Archive();
        const bwJson = JSON.parse(contents);

        // Create mapping between folder ids and groups
        groups[null] = archive.createGroup(defaultGroup);
        bwJson.folders.forEach(bitwardenFolder => {
            if (bitwardenFolder.name == "General") {
                groups[bitwardenFolder.id] = groups[null];
            } else {
                groups[bitwardenFolder.id] = archive.createGroup(
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
                    entry.setMeta("URL", bitwardenItem.login.uris[0].uri);
                }
            }

            if ("notes" in bitwardenItem) {
                entry.setMeta("Notes", bitwardenItem.notes);
            }

            if ("fields" in bitwardenItem) {
                bitwardenItem.fields.forEach(itemField => {
                    entry.setMeta(itemField.name, itemField.value);
                });
            }
        });

        return archive;
    });
};

module.exports = importFromBitwarden;
