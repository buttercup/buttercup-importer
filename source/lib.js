"use strict";

var KDBXImporter = require("./do_you_even/KDBXImporter.js");

module.exports = {

	importFrom1PIF: function(pifPath, password, destination) {
		
	},

	/**
	 * Import a Keepass 2 KDBX archive
	 * @param {String} kdbxFile A KDBX archive filename
	 * @param {String} password The password for the archive (loading KDBX and saving BCUP)
	 * @param {String} destination The destionation location to save the BCUP archive
	 * @returns {Promise}
	 */
	importFromKDBX: function(kdbxFile, password, destination) {
		var importer = new KDBXImporter(kdbxFile, destination);
		return importer.export(password).catch(function(err) {
			console.error("Failed exporting archive", err);
			throw err;
		});
	}

};
