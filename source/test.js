const path = require("path");

const OnePassImporter = require("./importers/1PasswordImporter.js");

const opi = new OnePassImporter(path.resolve(__dirname, "../tests/resources/test-1password.1pif"));
opi.export();