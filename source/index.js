"use strict";

const KDBXImporter = require("./importers/KDBXImporter.js");
const OnePasswordImporter = require("./importers/1PasswordImporter.js");

module.exports = {

	/**
	 * Import an exported 1Password (1pif) archive
	 * @param {String} pifPath The path to the 1password 1pif file
	 * @returns {Promise.<Archive>} A promise that resolves with the imported archive
	 */
	importFrom1PIF: function(pifPath) {
		const importer = new OnePasswordImporter(pifPath);
		return importer.export();
	},

	/**
	 * Import a Keepass 2 KDBX archive
	 * @param {String} kdbxFile A KDBX archive filename
	 * @param {String} password The password for the archive (loading KDBX and saving BCUP)
	 * @returns {Promise.<Archive>} A promise that resolves with the imported archive
	 */
	importFromKDBX: function(kdbxFile, password) {
		var importer = new KDBXImporter(kdbxFile);
		return importer.export(password);
	}

};
