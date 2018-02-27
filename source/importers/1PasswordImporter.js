"use strict";

const path = require("path");
const fs = require("fs");

const pify = require("pify");
const isDir = require("is-dir").sync;
const Buttercup = require("buttercup");

const { convert1pifToJSON } = require("../tools/1password.js");

const { Archive } = Buttercup;
const readFile = pify(fs.readFile);

/**
 * Map a 1PIF JSON tree back to an archive
 * @param {Archive|Group} parentArchiveItem A Buttercup Archive or Group instance
 * @param {Object} treeLevel A JSON group
 */
function mapTreeLevelToArchive(parentArchiveItem, treeLevel) {
    const group = parentArchiveItem.createGroup(treeLevel.title);
    treeLevel.entries.forEach(function(rawEntry) {
        const entry = group.createEntry(rawEntry.title);
        if (rawEntry.username) {
            entry.setProperty("username", rawEntry.username);
        }
        if (rawEntry.password) {
            entry.setProperty("password", rawEntry.password);
        }
        Object.keys(rawEntry.meta).forEach(function(metaKey) {
            entry.setMeta(metaKey, rawEntry.meta[metaKey]);
        });
        Object.keys(rawEntry.attributes).forEach(function(attributeKey) {
            entry.setAttribute(attributeKey, rawEntry.attributes[attributeKey]);
        });
    });
    treeLevel.groups.forEach(function(rawGroup) {
        mapTreeLevelToArchive(group, rawGroup);
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
            .then(contents => convert1pifToJSON(contents))
            .then(function(pifTree) {
                const archive = new Archive();
                mapTreeLevelToArchive(archive, pifTree);
                return archive;
            });
    }
}

module.exports = OnePasswordImporter;
