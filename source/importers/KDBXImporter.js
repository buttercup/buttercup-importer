"use strict";

var fs = require("fs"),
	kdbxweb = require("kdbxweb");

var Buttercup = require("buttercup"),
	KeePass2Importer = require("./KeePass2Importer.js");

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
	return (new Promise(function(resolve, reject) {
		fs.readFile(filename, function(err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	}))
	.then(function(kdbxRaw) {
		return new Promise(function(resolve, reject) {
			var credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password));
			kdbxweb.Kdbx.load(toArrayBuffer(kdbxRaw), credentials, function(db, err) {
				if (err) {
					return reject(err);
				}
				return resolve(db);
			});
		});
	})
	.then(function(db) {
		return new Promise(function(resolve) {
			// saveXml throws no error in callback, so just resolve
			db.saveXml(resolve);
		});
	})
	.then(function(xmlString) {
		var xmlImporter = new KeePass2Importer(xmlString);
		return xmlImporter.exportArchive();
	});
}

module.exports = KDBXImporter;
