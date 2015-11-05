(function() {

	"use strict";

	var kdbxweb = require("kdbxweb"),
		fs = require("fs");

	function toArrayBuffer(buffer) {
		var ab = new ArrayBuffer(buffer.length);
		var view = new Uint8Array(ab);
		for (var i = 0; i < buffer.length; ++i) {
			view[i] = buffer[i];
		}
		return ab;
	}

	fs.readFile("somefile.kdbx", function(err, data) {
		var credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString('pass'));
		kdbxweb.Kdbx.load(toArrayBuffer(data), credentials, function(db) {
			db.saveXml(function(xmlString) {
				console.log("XML", xmlString);
			});
		});
	});

})();
