const fs = require("fs");
const kdbxweb = require("kdbxweb");
const util = require("util");
const { argon2 } = require("../crypto/argon2.js");

kdbxweb.CryptoEngine.argon2 = argon2;

var Buttercup = require("buttercup"),
    KeePass2XMLImporter = require("./KeePass2XMLImporter.js");

const readFilePromise = util.promisify(fs.readFile);

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function KDBXImporter(filename) {
    this._filename = filename;
}

KDBXImporter.prototype.export = function(password, keyfile) {
    let filename = this._filename;
    let kdbxFiles = [readFilePromise(filename)];

    if (keyfile) {
        kdbxFiles.push(readFilePromise(keyfile));
    }

    return Promise.all(kdbxFiles)
        .then(function(kdbxRaw) {
            // 1st element, in the array, are the contents of the KDBX file
            // 2nd element, in the array, are the contents of the keyfile, if provided
            let credentials = new kdbxweb.Credentials(
                kdbxweb.ProtectedValue.fromString(password),
                kdbxRaw.length === 2 ? toArrayBuffer(kdbxRaw[1]) : undefined
            );
            return kdbxweb.Kdbx.load(toArrayBuffer(kdbxRaw[0]), credentials);
        })
        .then(function(db) {
            return db.saveXml();
        })
        .then(function(xmlString) {
            let xmlImporter = new KeePass2XMLImporter(xmlString);
            return xmlImporter.exportArchive();
        });
};

module.exports = KDBXImporter;
