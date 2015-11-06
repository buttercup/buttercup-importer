(function(module) {

	"use strict";

	var LIB_PATH = __dirname + "/do_you_even";

	module.exports = {

		importFromKDBX: function (kdbxFile, password, destination) {
			var KDBXImporter  = require(LIB_PATH + "/import_kdbx.js"),
				importer = new KDBXImporter(kdbxFile, destination);
			return importer.export(password).catch(function(err) {
				console.error("Failed exporting archive", err);
				throw err;
			});
		}

	};

})(module);
