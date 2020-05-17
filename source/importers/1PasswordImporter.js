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
 */
function mapTreeLevelToVault(parentVaultItem, treeLevel) {
    const group = parentVaultItem.createGroup(treeLevel.title);
    treeLevel.entries.forEach(function (rawEntry) {
        const entry = group.createEntry(rawEntry.title);
        Object.keys(rawEntry.meta).forEach(function (metaKey) {
            entry.setProperty(metaKey, rawEntry.meta[metaKey]);
        });
        if (rawEntry.username) {
            entry.setProperty("username", rawEntry.username);
        }
        if (rawEntry.password) {
            entry.setProperty("password", rawEntry.password);
        }
        Object.keys(rawEntry.attributes).forEach(function (attributeKey) {
            entry.setAttribute(attributeKey, rawEntry.attributes[attributeKey]);
        });
    });
    treeLevel.groups.forEach(function (rawGroup) {
        mapTreeLevelToVault(group, rawGroup);
    });
}

/**
 * Locate the true 1pif file in a path (may be directory)
 * @param {String} filePath Path to the directory or 1pif file
 * @returns {String} Resolve file path
 */
function resolve1pifFile(filePath) {
    if (isDir(filePath)) {
        return path.resolve(filePath, "./data.1pif");
    }
    return filePath;
}

class OnePasswordImporter {
    /**
     * Constructor for the importer
     * @param {String} onePIFPath The 1pif file path
     */
    constructor(onePIFPath) {
        this._path = resolve1pifFile(onePIFPath);
    }

    /**
     * The 1pif file path
     * @type {String}
     */
    get path() {
        return this._path;
    }

    /**
     * Export the 1pif data to a Buttercup Archive instance
     * @returns {Promise.<Archive>} A promise that resolves with a Buttercup
     * 	Archive instance
     */
    export() {
        return readFile(this.path, "utf8")
            .then((contents) => convert1pifToJSON(contents))
            .then(function (pifTree) {
                const vault = new Vault();
                mapTreeLevelToVault(vault, pifTree);
                return vault;
            });
    }
}

module.exports = OnePasswordImporter;
