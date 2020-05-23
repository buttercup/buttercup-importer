const fs = require("fs");
const xml2js = require("xml2js");
const VError = require("verror");
const { Vault } = require("buttercup");

function extractString(obj) {
    if (typeof obj === "string") {
        return obj;
    } else if (Array.isArray(obj)) {
        var first = obj.length > 0 ? obj[0] : false;
        if (typeof first === "object" && first.hasOwnProperty("_")) {
            return first["_"];
        }
        return obj.join(", ");
    } else {
        return obj ? obj.toString() : "";
    }
}

function processGroup(group, archive, currentGroup) {
    var subgroups = group.Group || [];
    currentGroup = currentGroup || archive;
    subgroups.forEach(function(subgroup) {
        var buttercupGroup = currentGroup.createGroup(
            extractString(subgroup.Name)
        );
        if (subgroup.Group) {
            processGroup(subgroup, archive, buttercupGroup);
        }
        if (subgroup.Entry) {
            subgroup.Entry.forEach(function(subentry) {
                var entry = buttercupGroup.createEntry();
                if (subentry.String) {
                    subentry.String.forEach(function(keyValuePair) {
                        var actualKey = extractString(keyValuePair.Key),
                            actualValue = extractString(keyValuePair.Value),
                            friendlyKey = actualKey.toLowerCase();
                        if (
                            ["title", "username", "password"].indexOf(
                                friendlyKey
                            ) >= 0
                        ) {
                            entry.setProperty(friendlyKey, actualValue);
                        } else {
                            entry.setProperty(actualKey, actualValue);
                        }
                    });
                }
            });
        }
    });
}

/**
 * Importer for KeePass XML exports
 * @memberof module:ButtercupImporter
 */
class KeePass2XMLImporter {
    /**
     * Create a new KeePass XML importer
     * @param {String} xmlContent The XML content to import from
     */
    constructor(xmlContent) {
        this._content = xmlContent;
    }

    /**
     * Export a vault from a KeePass 2 XML dump
     * @returns {Promise.<Vault>}
     * @memberof KeePass2XMLImporter
     */
    export() {
        const parser = new xml2js.Parser();
        return new Promise((resolve, reject) => {
            parser.parseString(this._content, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        })
            .then(function(keepassJS) {
                const vault = new Vault();
                let rootGroup;
                try {
                    rootGroup = keepassJS.KeePassFile.Root[0];
                } catch (err) {
                    console.warn("KeePass root group not found");
                }
                processGroup(rootGroup || {}, vault);
                return vault;
            })
            .catch(function(err) {
                throw new VError(err, "Failed parsing KDBX vault");
            });
    }
}

/**
 * Load XML from a file
 * @param {String} filename The file to read (XML)
 * @returns {Promise.<KeePass2XMLImporter>}
 * @memberof KeePass2XMLImporter
 * @static
 */
KeePass2XMLImporter.loadFromFile = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                return reject(err);
            }
            resolve(new KeePass2XMLImporter(data));
        });
    });
};

module.exports = KeePass2XMLImporter;
