"use strict";

const { onePasswordItemToEntry } = require("./1passwordEntry.js");

const ONEPASS_FOLDER = /^system\.folder/i;
const ONEPASS_SPACER = /^\*\*\*.+/;

function convert1pifToJSON(onePifRaw) {
    const items = onePifRaw
        .split(/\r\n|\n/)
        .map(line => line.trim())
        .filter(line =>
            line.length > 0 &&
            ONEPASS_SPACER.test(line) !== true
        )
        .map(line => JSON.parse(line));
    const groups = {};
    const entries = {};
    // let defaultGroup = null;
    items.forEach(function(item) {
        if (ONEPASS_FOLDER.test(item.typeName)) {
            const group = createGroupSkeleton(item.uuid);
            if (item.folderUuid) {
                group.parentID = item.folderUuid;
            }
            if (item.title) {
                group.title = item.title;
            }
            groups[item.uuid] = group;
        } else {
            const entry = onePasswordItemToEntry(item);
            if (entry) {
                entries[item.uuid] = entry;
            }
        }
    });
    return mergeItemsToTree(groups, entries);
}

function createGroupSkeleton(id) {
    return {
        id,
        title: "Untitled group",
        parentID: null,
        entries: [],
        groups: []
    };
}

function mergeItemsToTree(groups, entries, currentGroup) {
    const thisGroup = currentGroup || createGroupSkeleton(null);
    if (!currentGroup) {
        thisGroup.title = "Imported 1password archive";
    }
    Object.values(entries).forEach(function(entry) {
        if ((!entry.groupID && thisGroup.id === null) ||
            (entry.groupID && entry.groupID === thisGroup.id)) {
            thisGroup.entries.push(entry);
        }
    });
    Object.values(groups).forEach(function(group) {
        if (group.id && group.parentID === thisGroup.id) {
            thisGroup.groups.push(
                mergeItemsToTree(groups, entries, group)
            );
        }
    });
    return thisGroup;
}

module.exports = {
    convert1pifToJSON
};
