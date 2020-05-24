const path = require("path");
const fs = require("fs");
const pify = require("pify");
const isDir = require("is-dir").sync;
const Buttercup = require("buttercup");
const { convert1pifToJSON } = require("../tools/1password.js");

const { Vault } = Buttercup;
const readFile = pify(fs.readFile);

/**
 * Map a 1PIF JSON tree back to an archive
 * @param {Vault|Group} parentVaultItem A Buttercup Vault or Group instance
 * @param {Object} treeLevel A JSON group
 * @private
 */
function mapTreeLevelToVault(parentVaultItem, treeLevel) {
    const group = parentVaultItem.createGroup(treeLevel.title);
    treeLevel.entries.forEach(function(rawEntry) {
        const entry = group.createEntry(rawEntry.title);
        Object.keys(rawEntry.meta).forEach(function(metaKey) {
            entry.setProperty(metaKey, rawEntry.meta[metaKey]);
        });
        if (rawEntry.username) {
            entry.setProperty("username", rawEntry.username);
        }
        if (rawEntry.password) {
            entry.setProperty("password", rawEntry.password);
        }
        Object.keys(rawEntry.attributes).forEach(function(attributeKey) {
            entry.setAttribute(attributeKey, rawEntry.attributes[attributeKey]);
        });
    });
    treeLevel.groups.forEach(function(rawGroup) {
        mapTreeLevelToVault(group, rawGroup);
    });
}

/**
 * Locate the true 1pif file in a path (may be directory)
 * @param {String} filePath Path to the directory or 1pif file
 * @returns {String} Resolve file path
 * @private
 */
function resolve1pifFile(filePath) {
    if (isDir(filePath)) {
        return path.resolve(filePath, "./data.1pif");
    }
    return filePath;
}

/**
 * Importer for 1Password vaults
 * @memberof module:ButtercupImporter
 */
class OnePasswordImporter {
    /**
     * Constructor for the importer
     * @param {String} onePIFData 1pif file data
     */
    constructor(onePIFData) {
        this._data = onePIFData;
    }

    /**
     * Export the 1pif data to a Buttercup Vault instance
     * @returns {Promise.<Vault>} A promise that resolves with a Buttercup
     * 	Vault instance
     */
    export() {
        return Promise.resolve().then(() => {
            const pifTree = convert1pifToJSON(this._data);
            const vault = new Vault();
            mapTreeLevelToVault(vault, pifTree);
            return vault;
        });
    }
}

/**
 * Load an importer from a file
 * @param {String} filename The file to load from
 * @returns {Promise.<OnePasswordImporter>}
 * @static
 * @memberof OnePasswordImporter
 */
OnePasswordImporter.loadFromFile = function(filename) {
    const absolutePath = resolve1pifFile(filename);
    return readFile(absolutePath, "utf8").then(
        data => new OnePasswordImporter(data)
    );
};

module.exports = OnePasswordImporter;
