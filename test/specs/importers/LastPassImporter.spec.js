const path = require("path");
const LastPassImporter = require("../../../dist/importers/LastPassImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(__dirname, "../../resources/lastpass.csv");

describe("LastPassImporter", function() {
    beforeEach(function() {
        return LastPassImporter.loadFromFile(EXAMPLE_VAULT)
            .then(importer => importer.export())
            .then(vault => {
                this.vault = vault;
            });
    });

    it("creates a vault instance", function() {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("exports expected groups", function() {
        const groups = this.vault.getGroups().map(g => g.getTitle());
        expect(groups).to.contain("General");
    });

    it("exports expected entries", function() {
        const allEntries = this.vault.findEntriesByProperty("title", /.*/);
        expect(allEntries).to.have.lengthOf(4);
    });

    it("does not export entries with empty Notes", function() {
        const [entry1] = this.vault.findEntriesByProperty("title", "bar.com");
        const [entry2] = this.vault.findEntriesByProperty("title", "fizz.com");
        expect(entry1.getProperty("Notes")).to.be.undefined;
        expect(entry2.getProperty("Notes")).to.be.undefined;
    });

    it("exports multi-line notes", function() {
        const [entry] = this.vault.findEntriesByProperty("title", "baz.com");
        expect(entry.getProperty("Notes")).to.equal(
            "This is a\nmultiline string"
        );
    });
});
