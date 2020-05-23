const fs = require("fs");
const kdbxweb = require("kdbxweb");
const pify = require("pify");
const { argon2 } = require("../crypto/argon2.js");
const KeePass2XMLImporter = require("./KeePass2XMLImporter.js");

kdbxweb.CryptoEngine.argon2 = argon2;

const readFile = pify(fs.readFile);

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

/**
 * Importer for KDBX vaults (<= v4)
 * @memberof module:ButtercupImporter
 */
class KDBXImporter {
    /**
     * Create a new KDBX importer
     * @param {kdbxweb.Kdbx} kdbxDB KDBX database instance
     */
    constructor(kdbxDB) {
        this._db = kdbxDB;
    }

    /**
     * Export to a Buttercup vault
     * @returns {Promise.<Vault>}
     * @memberof KDBXImporter
     */
    export() {
        return Promise.resolve()
            .then(() => this._db.saveXml())
            .then(xmlString => {
                const xmlImporter = new KeePass2XMLImporter(xmlString);
                return xmlImporter.export();
            });
    }
}

/**
 * Load an importer from a KDBX file
 * @param {String} filename The file to load from
 * @param {String} password The vault password
 * @param {String=} keyfile The key filename, if applicable
 * @returns {Promise.<KDBXImporter>}
 * @static
 * @memberof KDBXImporter
 */
KDBXImporter.loadFromFile = function(filename, password, keyfile) {
    const kdbxFiles = [readFile(filename)];
    if (keyfile) {
        kdbxFiles.push(readFile(keyfile));
    }
    return Promise.all(kdbxFiles)
        .then(([baseFile, keyFile]) => {
            const credentials = new kdbxweb.Credentials(
                kdbxweb.ProtectedValue.fromString(password),
                keyFile ? toArrayBuffer(keyFile) : undefined
            );
            return kdbxweb.Kdbx.load(toArrayBuffer(baseFile), credentials);
        })
        .then(db => new KDBXImporter(db));
};

module.exports = KDBXImporter;
