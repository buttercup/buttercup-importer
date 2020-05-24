const path = require("path");
const fs = require("fs");
const { exportVaultToCSV } = require("@buttercup/exporter");
const { Entry, Group, Vault } = require("buttercup");
const ButtercupCSVImporter = require("../../../dist/importers/ButtercupCSVImporter.js");

const EXAMPLE_VAULT = path.resolve(__dirname, "../../resources/bcup.tmp.csv");

describe("ButtercupCSVImporter", function() {
    beforeEach(function() {
        const vault = new Vault();
        vault
            .createGroup("Test Group")
            .createEntry("Test")
            .setProperty("username", "user")
            .setProperty("password", "pass")
            .setProperty("URL", "http://test.com")
            .setProperty("secret", "value");
        return exportVaultToCSV(vault)
            .then(csv => {
                fs.writeFileSync(EXAMPLE_VAULT, csv);
            })
            .then(() => ButtercupCSVImporter.loadFromFile(EXAMPLE_VAULT))
            .then(importer => importer.export())
            .then(vault => {
                this.vault = vault;
            });
    });

    afterEach(function() {
        fs.unlinkSync(EXAMPLE_VAULT);
    });

    it("creates a vault instance", function() {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("exports expected groups", function() {
        const groups = this.vault.getGroups().map(g => g.getTitle());
        expect(groups).to.contain("Test Group");
    });

    it("exports expected entries", function() {
        const [entry] = this.vault.findEntriesByProperty("title", "Test");
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("username")).to.equal("user");
        expect(entry.getProperty("password")).to.equal("pass");
    });
});
