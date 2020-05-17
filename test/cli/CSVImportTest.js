const path = require("path");
const { importFromCSV } = require("../../dist/buttercup-importer.js");
const { Archive, Entry } = require("buttercup");

const csvArchive = path.resolve(__dirname, "../resources/chrome_pass.csv");

module.exports = {
    export: {
        createsArchive: test => {
            importFromCSV(csvArchive).then(archive => {
                test.ok(
                    archive instanceof Archive,
                    "Archive should be a Buttercup archive instance"
                );
                test.done();
            });
        },
        containsGroup: test => {
            importFromCSV(csvArchive).then(archive => {
                const groups = archive.toObject().groups.map(g => g.title);
                test.ok(groups.length === 1, "There should be one group");
                test.ok(
                    groups.includes("chrome_pass"),
                    "chrome_pass group should exist"
                );
                test.done();
            });
        },
        importsEmptyItem: test => {
            importFromCSV(csvArchive).then(archive => {
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
        }
    }
};
