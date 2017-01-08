"use strict";

var path = require("path");

var ButtercupImporter = require("../../source/index.js"),
	Buttercup = require("buttercup"),
	Archive = Buttercup.Archive,
	Group = Buttercup.Group;

module.exports = {

	setUp: function(cb) {
		this.exampleArchive = path.resolve(__dirname, "../resources/test-archive.kdbx");
		this.examplePassword = "passw0rd";
		cb();
	},

	export: {

		createsArchive: function(test) {
			ButtercupImporter
				.importFromKDBX(this.exampleArchive, this.examplePassword)
				.then(function(archive) {
					test.ok(archive instanceof Archive, "Archive should be a Buttercup archive instance");
					test.done();
				});
		},

		containsGroups: function(test) {
			ButtercupImporter
				.importFromKDBX(this.exampleArchive, this.examplePassword)
				.then(function(archive) {
					var rootGroup = archive.getGroups()[0];
					test.strictEqual(rootGroup.getTitle(), "Testing", "Root group should be called 'Testing'");
					var children = rootGroup.getGroups(),
						generalGroup;
					children.forEach(function(child) {
						if (child.getTitle() === "General") {
							generalGroup = child;
						}
					});
					test.ok(generalGroup instanceof Group, "Archive should contain General group");
					test.done();
				});
		},

		containsEntry: function(test) {
			ButtercupImporter
				.importFromKDBX(this.exampleArchive, this.examplePassword)
				.then(function(archive) {
					var children = archive.getGroups()[0].getGroups(),
						generalGroup;
					children.forEach(function(child) {
						if (child.getTitle() === "General") {
							generalGroup = child;
						}
					});
					var sampleEntry = generalGroup.getEntries()[0];
					test.strictEqual(sampleEntry.getProperty("title"), "Test-entry", "Title should be correct");
					test.strictEqual(sampleEntry.getProperty("username"), "buttercup", "Username should be correct");
					test.strictEqual(sampleEntry.getProperty("password"), "westley", "Password should be correct");
					test.done();
				}).catch(function(err) {
					console.error("Failed: " + err.message);
				});
		},

		throwsForIncorrectPassword: function(test) {
			ButtercupImporter.importFromKDBX(this.exampleArchive, "wrong password")
				.then(
					function() {
						throw new Error("Should not be here: error should have thrown");
					},
					function(err) {
						test.strictEqual(err.name, "KdbxError", "Error name should match");
						test.strictEqual(err.code, "InvalidKey", "Error code should match");
						test.done();
					}
				);
		}

	}

};