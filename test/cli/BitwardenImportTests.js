const path = require("path");

const { importFromBitwarden } = require("../../dist/buttercup-importer.js");
const { Archive, Entry } = require("buttercup");

const bwJsonPath = path.resolve(__dirname, "../resources/bitwarden.json");

module.exports = {
    export: {
        createsArchive: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                test.ok(
                    archive instanceof Archive,
                    "Archive should be a Buttercup archive instance"
                );
                test.done();
            });
        },
        containsGroups: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                const groups = archive.toObject().groups.map(g => g.title);
                test.ok(groups.length === 2, "There should be two groups");
                test.ok(
                    groups.includes("General"),
                    "General group should exist"
                );
                test.ok(groups.includes("FooBar"), "FooBar group should exist");
                test.done();
            });
        },
        importsEmptyItem: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                const [entry] = archive.findEntriesByProperty(
                    "title",
                    "Item without any info"
                );
                test.ok(
                    entry instanceof Entry,
                    "Item without any info entry should have been created"
                );
                test.ok(
                    entry.getProperty("username") === undefined,
                    "Username should be undefined"
                );
                test.ok(
                    entry.getProperty("password") === undefined,
                    "Password should be undefined"
                );
                test.done();
            });
        },
        importsLoginProperties: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                const [entry] = archive.findEntriesByProperty(
                    "title",
                    "Item with login"
                );
                test.ok(
                    entry instanceof Entry,
                    "Item with login entry should have been created"
                );
                test.ok(
                    entry.getProperty("username") === "username1",
                    "Username should be imported"
                );
                test.ok(
                    entry.getProperty("password") === "password1",
                    "Password should be imported"
                );
                test.done();
            });
        },
        importsUrlProperty: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                const [entry] = archive.findEntriesByProperty(
                    "title",
                    "Item with login uri"
                );
                test.ok(
                    entry instanceof Entry,
                    "Item with login uri entry should have been created"
                );
                test.ok(
                    entry.getProperty("URL") === "https://example.org",
                    "Extra property URL should be imported"
                );
                test.done();
            });
        },
        importsNoteProperty: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                const [entry] = archive.findEntriesByProperty(
                    "title",
                    "Item with notes"
                );
                test.ok(
                    entry instanceof Entry,
                    "Item with notes entry should have been created"
                );
                test.ok(
                    entry.getProperty("Notes") === "This is a note",
                    "Extra property Notes should be imported"
                );
                test.done();
            });
        },
        importsFieldsAsProperties: test => {
            importFromBitwarden(bwJsonPath).then(archive => {
                const [entry] = archive.findEntriesByProperty(
                    "title",
                    "Item with fields"
                );
                test.ok(
                    entry instanceof Entry,
                    "Item with fields entry should have been created"
                );
                test.ok(
                    entry.getProperty("field1") === "example.com",
                    "Extra property field1 should be imported"
                );
                test.ok(
                    entry.getProperty("field2") === "value2",
                    "Extra property field2 should be imported"
                );
                test.done();
            });
        }
    }
};
