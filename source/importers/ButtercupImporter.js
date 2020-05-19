const {
    Credentials,
    FileDatasource,
    Vault,
    consumeVaultFacade,
    createVaultFacade,
    init,
} = require("buttercup");

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
                path: this._filename,
            },
            masterPassword
        );
        const fds = new FileDatasource(creds);
        return fds.load(creds).then(({ Format, history }) => {
            const sourceVault = Vault.createFromHistory(history, Format);
            const newVault = new Vault(Format);
            consumeVaultFacade(newVault, createVaultFacade(sourceVault));
            return newVault;
        });
    }
}

module.exports = ButtercupImporter;
