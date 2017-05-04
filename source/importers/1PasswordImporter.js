"use strict";

const path = require("path");
const fs = require("fs");

const pify = require("pify");
const isDir = require("is-dir").sync;
const Buttercup = require("buttercup");

const {
	convert1pifToJSON
} = require("../tools/1password.js");

const {
	Archive
} = Buttercup;
const readFile = pify(fs.readFile);

function mapTreeLevelToArchive(parentArchiveItem, treeLevel) {
	const group = parentArchiveItem.createGroup(treeLevel.title);
	treeLevel.entries.forEach(function(rawEntry) {
		const entry = group.createEntry(rawEntry.title);
		if (rawEntry.username) {
			entry.setProperty("username", rawEntry.username);
		}
		if (rawEntry.password) {
			entry.setProperty("password", rawEntry.password);
		}
		Object.keys(rawEntry.meta).forEach(function(metaKey) {
			entry.setMeta(metaKey, rawEntry.meta[metaKey]);
		});
		Object.keys(rawEntry.attributes).forEach(function(attributeKey) {
			entry.setAttribute(attributeKey, rawEntry.attributes[attributeKey]);
		});
	});
	treeLevel.groups.forEach(function(rawGroup) {
		mapTreeLevelToArchive(group, rawGroup);
	});
}

function normalise1pifFile(filePath) {
	if (isDir(filePath)) {
		return path.resolve(filePath, "./data.1pif");
	}
	return filePath;
}

class OnePasswordImporter {

	constructor(onePIFPath) {
		this._path = normalise1pifFile(onePIFPath);
	}

	get path() {
		return this._path;
	}

	export() {
		return readFile(this.path, "utf8")
			.then(contents => convert1pifToJSON(contents))
			.then(function(pifTree) {
				const archive = new Archive();
				mapTreeLevelToArchive(archive, pifTree);
				return archive;
			});
	}

}

module.exports = OnePasswordImporter;
