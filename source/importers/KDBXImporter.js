const fs = require("fs");
const kdbxweb = require("kdbxweb");
const { argon2 } = require("../crypto/argon2.js");

kdbxweb.CryptoEngine.argon2 = argon2;

var Buttercup = require("buttercup"),
    KeePass2XMLImporter = require("./KeePass2XMLImporter.js");

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

KDBXImporter.prototype.export = function(password) {
    var filename = this._filename;
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    })
        .then(function(kdbxRaw) {
            var credentials = new kdbxweb.Credentials(
                kdbxweb.ProtectedValue.fromString(password)
            );
            return kdbxweb.Kdbx.load(toArrayBuffer(kdbxRaw), credentials);
        })
        .then(function(db) {
            return db.saveXml();
        })
        .then(function(xmlString) {
            var xmlImporter = new KeePass2XMLImporter(xmlString);
            return xmlImporter.exportArchive();
        });
};

module.exports = KDBXImporter;
