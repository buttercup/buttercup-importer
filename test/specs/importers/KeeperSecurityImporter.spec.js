const path = require("path");
const KeeperSecurityImporter = require("../../../dist/importers/KeeperSecurityImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_VAULT = path.resolve(__dirname, "../../resources/keeper.json");

describe("KeeperSecurityImporter", function () {
    beforeEach(function () {
        return KeeperSecurityImporter.loadFromFile(EXAMPLE_VAULT)
            .then((importer) => importer.export())
            .then((vault) => {
                this.vault = vault;
            });
    });

    it("creates a vault instance", function () {
        expect(this.vault).to.be.an.instanceOf(Vault);
    });

    it("contains expected groups", function () {
        // I'd prefer to use the function 'getGroups' however, this seems to be missing groups in the _groups structure?
        const groups = this.vault._groups.map((g) => g.getTitle());
        expect(groups).to.have.lengthOf(3);
        expect(groups).to.contain("Foo");
        expect(groups).to.contain("Bar");
    });

    it("imports login properties", function () {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item with login"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("username")).to.equal("username1");
        expect(entry.getProperty("password")).to.equal("password1");
    });

    it("imports URLs", function () {
        const [entry] = this.vault.findEntriesByProperty(
            "title",
            "Item with login uri"
        );
        expect(entry).to.be.an.instanceOf(Entry);
        expect(entry.getProperty("URL")).to.equal("https://example.org/");
        // @todo should be a website
    });
});
