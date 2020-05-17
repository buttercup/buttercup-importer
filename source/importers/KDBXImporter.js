const fs = require("fs");
const kdbxweb = require("kdbxweb");
const util = require("util");
const { argon2 } = require("../crypto/argon2.js");
const KeePass2XMLImporter = require("./KeePass2XMLImporter.js");

kdbxweb.CryptoEngine.argon2 = argon2;

const readFilePromise = util.promisify(fs.readFile);

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

class KDBXImporter {
    constructor(filename) {
        this._filename = filename;
    }

    export(password, keyfile) {
        const kdbxFiles = [readFilePromise(this._filename)];
        if (keyfile) {
            kdbxFiles.push(readFilePromise(keyfile));
        }

        return Promise.all(kdbxFiles)
            .then(([baseFile, keyFile]) => {
                // 1st element, in the array, are the contents of the KDBX file
                // 2nd element, in the array, are the contents of the keyfile, if provided
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
