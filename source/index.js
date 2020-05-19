// import "core-js/stable";

// import OnePasswordImporter from "./importers/1PasswordImporter.js";
// import KDBXImporter from "./importers/KDBXImporter.js";

// export { default as KDBXImporter } from "./importers/KDBXImporter.js";
// export {
//     default as KeePass2XMLImporter
// } from "./importers/KeePass2XMLImporter.js";

// /**
//  * Import an exported 1Password (1pif) archive
//  * @param {String} pifPath The path to the 1password 1pif file
//  * @returns {Promise.<Archive>} A promise that resolves with the imported archive
//  */
// export function importFrom1PIF(pifPath) {
//     const importer = new OnePasswordImporter(pifPath);
//     return importer.export();
// }

// /**
//  * Import a Keepass 2 KDBX archive
//  * @param {String} kdbxFile A KDBX archive filename
//  * @param {String} password The password for the archive (loading KDBX and saving BCUP)
//  * @param {String} [keyFile] The key file for the archive (optional)
//  * @returns {Promise.<Archive>} A promise that resolves with the imported archive
//  */
// export function importFromKDBX(kdbxFile, password, keyFile) {
//     const importer = new KDBXImporter(kdbxFile);
//     return importer.export(password, keyFile);
// }

// export { default as importFromLastPass } from "./importers/LastPassImporter.js";
// export {
//     default as importFromButtercup
// } from "./importers/ButtercupImporter.js";
// export {
//     default as importFromBitwarden
// } from "./importers/BitwardenImporter.js";
// export { default as importFromCSV } from "./importers/CSVImporter.js";
