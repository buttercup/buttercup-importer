"use strict";

const path = require("path");

const ButtercupImporter = require("../../source/index.js");
const { Archive, Group, Entry } = require("buttercup");

module.exports = {
    setUp: function(cb) {
        this.exampleArchive = path.resolve(
            __dirname,
            "../resources/test-1password.1pif"
        );
        cb();
    },

    export: {
        createsArchive: function(test) {
            ButtercupImporter.importFrom1PIF(this.exampleArchive).then(function(
                archive
            ) {
                test.ok(
                    archive instanceof Archive,
                    "Archive should be a Buttercup archive instance"
                );
                test.done();
            });
        },

        containsGroups: function(test) {
            ButtercupImporter.importFrom1PIF(this.exampleArchive)
                .then(function(archive) {
                    const rootGroup = archive.getGroups()[0];
                    test.ok(
                        /Imported 1password archive/i.test(
                            rootGroup.getTitle()
                        ),
                        "Root group should be named correctly"
                    );
                    const generalGroup = rootGroup.findGroupsByTitle(
                        "General"
                    )[0];
                    test.ok(
                        generalGroup instanceof Group,
                        "General group should exist"
                    );
                    const subGroup = generalGroup.findGroupsByTitle("Sub")[0];
                    test.ok(
                        subGroup instanceof Group,
                        "Sub group should exist"
                    );
                })
                .then(test.done);
        },

        containsEntries: function(test) {
            ButtercupImporter.importFrom1PIF(this.exampleArchive)
                .then(function(archive) {
                    const testEntry = archive.findEntriesByProperty(
                        "title",
                        "Test"
                    )[0];
                    const customCard = archive.findEntriesByProperty(
                        "title",
                        "Custom card"
                    )[0];
                    test.ok(
                        testEntry instanceof Entry,
                        "Test entry should exist"
                    );
                    test.ok(
                        customCard instanceof Entry,
                        "Custom card entry should exist"
                    );
                })
                .then(test.done);
        }
    }
};
