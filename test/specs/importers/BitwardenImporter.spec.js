const path = require("path");
const BitwardenImporter = require("../../../dist/importers/BitwardenImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(__dirname, "../../resources/bitwarden.json");

describe("BitwardenImporter", function() {
    beforeEach(function() {
        return BitwardenImporter.loadFromFile(EXAMPLE_VAULT)
            .then(importer => importer.export())
            .then(vault => {
                this.vault = vault;
            });
    });

    it("creates a vault instance", function() {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("cantains expected groups", function() {
        const groups = this.vault.getGroups().map(g => g.getTitle());
        expect(groups).to.have.lengthOf(2);
        expect(groups).to.contain("General");
        expect(groups).to.contain("FooBar");
    });

    it("contains expected entries", function() {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item without any info"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("username")).to.be.undefined;
        expect(entry.getProperty("password")).to.be.undefined;
    });

    it("imports login properties", function() {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item with login"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("username")).to.equal("username1");
        expect(entry.getProperty("password")).to.equal("password1");
        // @todo should be a login
    });

    it("imports URLs", function() {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item with login uri"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("URL")).to.equal("https://example.org");
        // @todo should be a website
    });

    it("imports notes", function() {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item with notes"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("Notes")).to.equal("This is a note");
        // @todo should be a note
    });

    it("imports fields as properties", function() {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item with fields"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("field1")).to.equal("example.com");
        expect(entry.getProperty("field2")).to.equal("value2");
    });
});
