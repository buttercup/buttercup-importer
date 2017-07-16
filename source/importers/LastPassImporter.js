"use strict";

const path = require("path");
const fs = require("fs");

const pify = require("pify");
const { Archive } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const defaultGroup = "General";

/**
 * Import an exported LastPass CSV archive
 * @param {String} lpcsvPath The path to the LastPass CSV file
 * @returns {Promise.<Archive>} A promise that resolves with the imported archive
 */
const importFromLastPass = lpcsvPath => {
	const groups = {};

	return pify(fs.readFile)(lpcsvPath, "utf8")
		.then(contents => {
			const archive = new Archive();
			csvparse(contents, {columns: true}).forEach(lastpassItem => {
				const groupName = lastpassItem.grouping || defaultGroup;
				const group = groups[groupName] || (groups[groupName] = archive.createGroup(groupName));
				const entry = group
					.createEntry(lastpassItem.name)
					.setProperty("username", lastpassItem.username)
					.setProperty("password", lastpassItem.password)
					.setMeta("URL", lastpassItem.url);
				if(lastpassItem.extra) {
					entry.setMeta("Notes", lastpassItem.extra);
				}
			});

			return archive;
		});
};

module.exports = importFromLastPass;
