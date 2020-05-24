const path = require("path");
const KeePass2XMLImporter = require("../../../dist/importers/KeePass2XMLImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(__dirname, "../../resources/test.kdbx.xml");

describe("KeePass2XMLImporter", function() {
    beforeEach(function() {
        return KeePass2XMLImporter.loadFromFile(EXAMPLE_VAULT)
            .then(importer => importer.export())
            .then(vault => {
                this.vault = vault;
            });
    });

    it("creates a vault instance", function() {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("exports expected groups", function() {
        const group = this.vault.findGroupsByTitle("Buttercup")[0];
        expect(group).to.be.an.instanceOf(Group);
    });

    it("exports expected child groups", function() {
        const group = this.vault.findGroupsByTitle("Recycle Bin")[0];
        expect(group).to.be.an.instanceOf(Group);
    });

    it("exports expected entries", function() {
        const entry = this.vault.findEntriesByProperty(
            "title",
            "Buttercup test"
        )[0];
        expect(entry).to.be.an.instanceOf(Entry);
    });

    it("exports expected properties", function() {
        const entry = this.vault.findEntriesByProperty(
            "title",
            "Buttercup test"
        )[0];
        expect(entry.getProperty("Notes")).to.equal(
            "Hello. My name is Inigo Montoya. You killed my father. Prepare to die."
        );
        expect(entry.getProperty("password")).to.equal("test password");
    });
});
