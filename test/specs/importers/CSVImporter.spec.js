const path = require("path");
const CSVImporter = require("../../../dist/importers/CSVImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(
    __dirname,
    "../../resources/chrome_pass.csv"
);

describe("CSVImporter", function() {
    beforeEach(function() {
        return CSVImporter.loadFromFile(EXAMPLE_VAULT)
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
        expect(groups).to.contain("chrome_pass");
    });

    it("exports expected entries", function() {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item without any info"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("username")).to.be.undefined;
        expect(entry.getProperty("password")).to.be.undefined;
    });
});
