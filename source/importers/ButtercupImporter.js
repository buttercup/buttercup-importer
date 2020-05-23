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

class ButtercupImporter {
    constructor(filename) {
        this._filename = filename;
    }

    /**
     * Export as a new Buttercup vault
     * @param {String} masterPassword Source vault master password
     * @returns {Promise.<Vault>}
     * @memberof ButtercupImporter
     */
    export(masterPassword) {
        init();
        const creds = new Credentials(
            {
                datasource: {
                    path: this._filename
                }
            },
            masterPassword
        );
        const fds = new FileDatasource(creds);
        return fds
            .load(Credentials.fromPassword(masterPassword))
            .then(({ Format, history }) => {
                const sourceVault = Vault.createFromHistory(history, Format);
                const newVault = new Vault(Format);
                const facade = updateFacadeItemIDs(
                    stripTrash(createVaultFacade(sourceVault))
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

module.exports = ButtercupImporter;
