const fs = require("fs");
const path = require("path");
const { exportArchiveToCSV } = require("@buttercup/exporter");
const { Archive, Group, Entry } = require("buttercup");
const { importFromButtercup } = require("../../dist/buttercup-importer.js");

const CSV_PATH = path.resolve(__dirname, "./bcup.tmp.csv");

module.exports = {
    setUp: function(cb) {
        const archive = new Archive();
        archive
            .createGroup("General")
            .createEntry("Test")
            .setProperty("username", "user")
            .setProperty("password", "pass")
            .setProperty("URL", "http://test.com")
            .setProperty("secret", "value");
        exportArchiveToCSV(archive)
            .then(csv => {
                fs.writeFileSync(CSV_PATH, csv);
                cb();
            })
            .catch(cb);
    },
    export: {
        importsGroupsFromButtercup: test => {
            importFromButtercup(CSV_PATH).then(archive => {
                const [group] = archive.findGroupsByTitle("General");
                test.ok(
                    group instanceof Group,
                    "General group should have been created"
                );
                test.done();
            });
        },
        importsEntriesFromButtercup: test => {
            importFromButtercup(CSV_PATH).then(archive => {
                const [entry] = archive.findEntriesByProperty("title", "Test");
                test.ok(
                    entry instanceof Entry,
                    "Test entry should have been created"
                );
                test.done();
            });
        },
        importsEntryCoreProperties: test => {
            importFromButtercup(CSV_PATH).then(archive => {
                const [entry] = archive.findEntriesByProperty("title", "Test");
                test.ok(
                    entry.getProperty("username") === "user",
                    "Username should be imported"
                );
                test.ok(
                    entry.getProperty("password") === "pass",
                    "Password should be imported"
                );
                test.done();
            });
        },
        importsEntryExtraProperties: test => {
            importFromButtercup(CSV_PATH).then(archive => {
                const [entry] = archive.findEntriesByProperty("title", "Test");
                test.ok(
                    entry.getProperty("URL") === "http://test.com",
                    "Extra properties should be imported"
                );
                test.ok(
                    entry.getProperty("secret") === "value",
                    "Extra properties should be imported"
                );
                test.done();
            });
        }
    }
};
