"use strict";

var KDBXImporter = require("./do_you_even/KDBXImporter.js");

module.exports = {

	importFrom1PIF: function(pifPath, password, destination) {
		throw new Error("Not implemented");
	},

	/**
	 * Import a Keepass 2 KDBX archive
	 * @param {String} kdbxFile A KDBX archive filename
	 * @param {String} password The password for the archive (loading KDBX and saving BCUP)
	 * @returns {Promise}
	 */
	importFromKDBX: function(kdbxFile, password) {
		var importer = new KDBXImporter(kdbxFile);
		return importer.export(password);
	}

};
