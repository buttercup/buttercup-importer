const {
    Credentials,
    FileDatasource,
    Group,
    Vault,
    consumeVaultFacade,
    createVaultFacade,
    init
} = require("buttercup");

const FACADE_MIN_VER = 2;

function stripTrash(vaultFacade) {
    const trashGroup = vaultFacade.groups.find(
        group =>
            group.attributes &&
            group.attributes[Group.Attribute.Role] === "trash"
    );
    if (trashGroup) {
        vaultFacade.groups.splice(vaultFacade.groups.indexOf(trashGroup), 1);
    }
    return vaultFacade;
}

function updateFacadeItemIDs(vaultFacade) {
    const idMap = {};
    let nextID = 1;
    vaultFacade.groups.forEach(group => {
        const newID = (idMap[group.id] = nextID.toString());
        nextID += 1;
        group.id = newID;
    });
    vaultFacade.groups.forEach(group => {
        if (group.parentID != "0") {
            const originalParentID = group.parentID;
            group.parentID = idMap[originalParentID];
            if (!group.parentID) {
                throw new Error(`Bad group parent ID: ${originalParentID}`);
            }
        }
    });
    vaultFacade.entries.forEach(entry => {
        entry.id = nextID.toString();
        nextID += 1;
        const originalParentID = entry.parentID;
        entry.parentID = idMap[originalParentID];
        if (!entry.parentID) {
            throw new Error(`Bad entry parent ID: ${originalParentID}`);
        }
    });
    return vaultFacade;
}

/**
 * Importer for Buttercup vaults
 * @memberof module:ButtercupImporter
 */
class ButtercupImporter {
    /**
     * Create a new Buttercup importer
     * @param {Vault} sourceVault Source Buttercup vault
     */
    constructor(sourceVault) {
        this._source = sourceVault;
        this._Format = sourceVault.format.getFormat();
    }

    /**
     * Export as a new Buttercup vault
     * @returns {Promise.<Vault>}
     * @memberof ButtercupImporter
     */
    export() {
        init();
        return Promise.resolve().then(() => {
            const newVault = new Vault(this._Format);
            const facade = updateFacadeItemIDs(
                stripTrash(createVaultFacade(this._source))
            );
            if (facade._ver >= FACADE_MIN_VER === false) {
                throw new Error("Invalid or old facade version");
            }
            facade.id = newVault.id;
            consumeVaultFacade(newVault, facade);
            return newVault;
        });
    }
}

/**
 * Load an importer from a vault file
 * @param {String} filename The vault path
 * @param {String} masterPassword The vault password
 * @returns {Promise.<ButtercupImporter>}
 * @memberof ButtercupImporter
 * @static
 */
ButtercupImporter.loadFromFile = function(filename, masterPassword) {
    init();
    const creds = new Credentials(
        {
            datasource: {
                path: filename
            }
        },
        masterPassword
    );
    const fds = new FileDatasource(creds);
    return fds
        .load(Credentials.fromPassword(masterPassword))
        .then(({ Format, history }) => {
            const sourceVault = Vault.createFromHistory(history, Format);
            return new ButtercupImporter(sourceVault);
        });
};

module.exports = ButtercupImporter;
