const path = require("path");
const KDBXImporter = require("../../../dist/importers/KDBXImporter.js");
const { Entry, Group, Vault } = require("buttercup");

const EXAMPLE_KDBX_PASSWORD = "passw0rd";

const EXAMPLE_LEGACY = path.resolve(
    __dirname,
    "../../resources/test-archive-kdbx3.kdbx"
);
const EXAMPLE_LEGACY_ADVANCED = path.resolve(
    __dirname,
    "../../resources/test-archive-keyfile-kdbx3.kdbx"
);
const EXAMPLE_LEGACY_ADVANCED_KEY = path.resolve(
    __dirname,
    "../../resources/test-archive-keyfile-kdbx3.key"
);

const EXAMPLE_V4 = path.resolve(
    __dirname,
    "../../resources/test-archive-kdbx4.kdbx"
);
const EXAMPLE_V4_ADVANCED = path.resolve(
    __dirname,
    "../../resources/test-archive-keyfile-kdbx4.kdbx"
);
const EXAMPLE_V4_ADVANCED_KEY = path.resolve(
    __dirname,
    "../../resources/test-archive-keyfile-kdbx4.key"
);

describe("KDBXImporter", function() {
    describe("KDBX (pre-v4)", function() {
        beforeEach(function() {
            return Promise.all([
                KDBXImporter.loadFromFile(
                    EXAMPLE_LEGACY,
                    EXAMPLE_KDBX_PASSWORD
                ).then(importer => importer.export()),
                KDBXImporter.loadFromFile(
                    EXAMPLE_LEGACY_ADVANCED,
                    EXAMPLE_KDBX_PASSWORD,
                    EXAMPLE_LEGACY_ADVANCED_KEY
                ).then(importer => importer.export())
            ]).then(([simpleVault, advancedVault]) => {
                this.simpleVault = simpleVault;
                this.advancedVault = advancedVault;
            });
        });

        it("creates a vault instance (without-key)", function() {
            expect(this.simpleVault).to.be.an.instanceOf(Vault);
        });

        it("creates a vault instance (with-key)", function() {
            expect(this.advancedVault).to.be.an.instanceOf(Vault);
        });

        it("exports expected groups", function() {
            const [rootGroup] = this.simpleVault.findGroupsByTitle("Testing");
            const [generalGroup] = this.simpleVault.findGroupsByTitle(
                "General"
            );
            expect(rootGroup).to.be.an.instanceOf(Group);
            expect(generalGroup).to.be.an.instanceOf(Group);
        });

        it("exports expected entries", function() {
            const [sampleEntry] = this.simpleVault.findEntriesByProperty(
                "title",
                /^Test-entry$/
            );
            expect(sampleEntry.getProperty("username")).to.equal("buttercup");
            expect(sampleEntry.getProperty("password")).to.equal("westley");
        });
    });

    describe("KDBX v4", function() {
        beforeEach(function() {
            return Promise.all([
                KDBXImporter.loadFromFile(
                    EXAMPLE_V4,
                    EXAMPLE_KDBX_PASSWORD
                ).then(importer => importer.export()),
                KDBXImporter.loadFromFile(
                    EXAMPLE_V4_ADVANCED,
                    EXAMPLE_KDBX_PASSWORD,
                    EXAMPLE_V4_ADVANCED_KEY
                ).then(importer => importer.export())
            ]).then(([simpleVault, advancedVault]) => {
                this.simpleVault = simpleVault;
                this.advancedVault = advancedVault;
            });
        });

        it("creates a vault instance (without-key)", function() {
            expect(this.simpleVault).to.be.an.instanceOf(Vault);
        });

        it("creates a vault instance (with-key)", function() {
            expect(this.advancedVault).to.be.an.instanceOf(Vault);
        });

        it("exports expected groups", function() {
            const [rootGroup] = this.simpleVault.findGroupsByTitle("Testing");
            const [generalGroup] = this.simpleVault.findGroupsByTitle(
                "General"
            );
            expect(rootGroup).to.be.an.instanceOf(Group);
            expect(generalGroup).to.be.an.instanceOf(Group);
        });

        it("exports expected entries", function() {
            const [sampleEntry] = this.simpleVault.findEntriesByProperty(
                "title",
                /^Test-entry$/
            );
            expect(sampleEntry.getProperty("username")).to.equal("buttercup");
            expect(sampleEntry.getProperty("password")).to.equal("westley");
        });
    });
});
