(function(module) {

	"use strict";

	var fs = require("fs"),
		kdbxweb = require("kdbxweb");

	var Buttercup = require("buttercup"),
		KeePass2Importer = require(__dirname + "/KeePass2Importer.js");
		//KeePass2XMLImporter = Buttercup.KeePass2XMLImporter;

	function toArrayBuffer(buffer) {
		var ab = new ArrayBuffer(buffer.length);
		var view = new Uint8Array(ab);
		for (var i = 0; i < buffer.length; ++i) {
			view[i] = buffer[i];
		}
		return ab;
	}

	function KDBXImporter(filename, destination) {
		this._filename = filename;
		this._destination = destination;
	}

	KDBXImporter.prototype.export = function(password) {
		var filename = this._filename,
			destination = this._destination;
		return (new Promise(function(resolve, reject) {
			fs.readFile(filename, function(err, data) {
				if (err) {
					(reject)(err);
				} else {
					(resolve)(data);
				}
			});
		})).then(function(kdbxRaw) {
			return new Promise(function(resolve) {
				var credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password));
				kdbxweb.Kdbx.load(toArrayBuffer(kdbxRaw), credentials, resolve);
			});
		}).then(function(db) {
			return new Promise(function(resolve) {
				db.saveXml(resolve);
			});
		}).then(function(xmlString) {
			var xmlImporter = new KeePass2Importer(xmlString);
			return xmlImporter.exportArchive()
				.then(function(archive) {
					var workspace = new Buttercup.Workspace(),
						datasource = new Buttercup.FileDatasource(destination);
					workspace
						.setPassword(password)
						.setArchive(archive)
						.setDatasource(datasource)
						.save();
					return archive;
				});
		});
	}

	module.exports = KDBXImporter;

})(module);
