const path = require("path");
const OnePasswordImporter = require("../../../dist/importers/OnePasswordImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(
    __dirname,
    "../../resources/test-1password.1pif"
);

describe("OnePasswordImporter", function() {
    beforeEach(function() {
        return OnePasswordImporter.loadFromFile(EXAMPLE_VAULT)
            .then(importer => importer.export())
            .then(vault => {
                this.vault = vault;
            });
    });

    it("creates a vault instance", function() {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("cantains expected groups", function() {
        const generalGroup = this.vault.findGroupsByTitle("General")[0];
        expect(generalGroup).to.be.an.instanceOf(Group);
        const subGroup = generalGroup.findGroupsByTitle("Sub")[0];
        expect(subGroup).to.be.an.instanceOf(Group);
    });

    it("contains expected entries", function() {
        const testEntry = this.vault.findEntriesByProperty("title", "Test")[0];
        const customCard = this.vault.findEntriesByProperty(
            "title",
            "Custom card"
        )[0];
        expect(testEntry).to.be.an.instanceOf(Entry);
        expect(customCard).to.be.an.instanceOf(Entry);
    });
});
