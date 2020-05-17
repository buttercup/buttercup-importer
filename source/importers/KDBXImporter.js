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

class KDBXImporter {
    constructor(filename, keyfile = null) {
        this._filename = filename;
        this._keyFilename = keyfile;
    }

    export(password) {
        const kdbxFiles = [readFile(this._filename)];
        if (this._keyFilename) {
            kdbxFiles.push(readFile(this._keyFilename));
        }
        return Promise.all(kdbxFiles)
            .then(([baseFile, keyFile]) => {
                const credentials = new kdbxweb.Credentials(
                    kdbxweb.ProtectedValue.fromString(password),
                    keyFile ? toArrayBuffer(keyFile) : undefined
                );
                return kdbxweb.Kdbx.load(toArrayBuffer(baseFile), credentials);
            })
            .then((db) => db.saveXml())
            .then((xmlString) => {
                const xmlImporter = new KeePass2XMLImporter(xmlString);
                return xmlImporter.export();
            });
    }
}

module.exports = KDBXImporter;
