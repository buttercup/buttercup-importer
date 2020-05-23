const path = require("path");
const ButtercupImporter = require("../../../dist/importers/ButtercupImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(__dirname, "../../resources/test.bcup");

describe("ButtercupImporter", function() {
    beforeEach(function() {
        return ButtercupImporter.loadFromFile(EXAMPLE_VAULT, "passw0rd")
            .then(importer => importer.export())
            .then(vault => {
                this.vault = vault;
            });
    });

    it("creates a vault instance", function() {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("exports expected groups", function() {
        const [general] = this.vault.findGroupsByTitle("General");
        expect(general).to.be.an.instanceOf(
            Group,
            "General group should exist"
        );
        const [sub] = general.getGroups();
        expect(sub).to.be.an.instanceOf(
            Group,
            "Sub group should exist under General"
        );
    });

    it("exports expected entries", function() {
        const allEntries = this.vault.findEntriesByProperty("title", /.*/);
        expect(allEntries).to.have.lengthOf(1);
        const [entry] = allEntries;
        expect(entry.getProperty("title")).to.equal("Test Entry");
        expect(entry.getProperty("username")).to.equal("user@site.com");
        expect(entry.getProperty("password")).to.equal(
            "W6dV-_71OpO~%;WZz0+*czcqay+&=;8;khc"
        );
    });
});
