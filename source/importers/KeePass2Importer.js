(function(module) {

	"use strict";

	var fs = require("fs"),
		xml2js = require('xml2js');

	var Buttercup = require("buttercup");

	var Archive = Buttercup.Archive,
		ManagedGroup = Buttercup.ManagedGroup,
		ManagedEntry = Buttercup.ManagedEntry;

	// --- helpers

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
			return (obj) ? obj.toString() : "";
		}
	}

	function processGroup(group, archive, currentGroup) {
		var subgroups = group.Group || [];
		currentGroup = currentGroup || archive;
		subgroups.forEach(function(subgroup) {
			var buttercupGroup = currentGroup.createGroup(extractString(subgroup.Name));
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
							if (["title", "username", "password"].indexOf(friendlyKey) >= 0) {
								entry.setProperty(friendlyKey, actualValue);
							} else {
								entry.setMeta(actualKey, actualValue);
							}
						});
					}
				});
			}
		});
	}

	// --- class

	var KeePass2Importer = function(xmlContent) {
		this._content = xmlContent;
	};

	KeePass2Importer.prototype.exportArchive = function() {
		var parser = new xml2js.Parser(),
			xmlContent = this._content;
		return (new Promise(function(resolve, reject) {
			parser.parseString(xmlContent, function (err, result) {
				if (err) {
					(reject)(err);
				} else {
					(resolve)(result);
				}
			});
		})).then(function(keepassJS) {
			var archive = new Archive(),
				rootGroup;
			try {
				rootGroup = keepassJS.KeePassFile.Root[0];
			} catch (err) {
				console.error("KeePass root group not found");
			}
			processGroup(
				rootGroup || {},
				archive
			);
			return archive;
		}).catch(function(err) {
			console.error("Failed parsing KDBX archive: " + err.message);
		});
	};

	KeePass2Importer.loadFromFile = function(filename) {
		return new Promise(function(resolve, reject) {
			fs.readFile(filename, function(err, data) {
				if (err) {
					(reject)(err);
				} else {
					(resolve)(new KeePass2Importer(data));
				}
			});
		});
	};

	module.exports = KeePass2Importer;

})(module);
