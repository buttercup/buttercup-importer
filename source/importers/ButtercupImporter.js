const {
    Credentials,
    FileDatasource,
    Vault,
    consumeVaultFacade,
    createVaultFacade,
    init
} = require("buttercup");
const { v4: uuid } = require("uuid");

function stripTrash(vaultFacade) {
    return vaultFacade;
}

function updateFacadeItemIDs(vaultFacade) {
    const idMap = {};
    console.log(JSON.stringify(vaultFacade, undefined, 4));
    vaultFacade.groups.forEach(group => {
        const newID = (idMap[group.id] = uuid());
        group.id = newID;
    });
    vaultFacade.groups.forEach(group => {
        if (group.parentID != "0") {
            const originalParentID = group.parentID;
            group.parentID = idMap[originalParentID];
            if (!group.parentID) {
                throw new Error(`Bad parent ID: ${originalParentID}`);
            }
        }
    });
    // @todo entries
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
                facade.id = newVault.id;
                consumeVaultFacade(newVault, facade);
                return newVault;
            });
    }
}

module.exports = ButtercupImporter;
