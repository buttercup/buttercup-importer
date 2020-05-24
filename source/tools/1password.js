const { onePasswordItemToEntry } = require("./1passwordEntry.js");

const ONEPASS_FOLDER = /^system\.folder/i;
const ONEPASS_SPACER = /^\*\*\*.+/;

/**
 * Convert raw 1pif text to a JSON tree
 * @param {String} onePifRaw Exported 1PIF content
 * @returns {Object} Raw archive structure
 */
function convert1pifToJSON(onePifRaw) {
    const items = onePifRaw
        .split(/\r\n|\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0 && ONEPASS_SPACER.test(line) !== true)
        .map(line => JSON.parse(line));
    const groups = {};
    const entries = {};
    // let defaultGroup = null;

    const groupNames = items
        .map(item => item.typeName)
        .filter(typeName => !ONEPASS_FOLDER.test(typeName));
    [...new Set(groupNames)].forEach(groupName => {
        groups[groupName] = createGroupSkeleton(groupName, groupName);
    });

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

/**
 * Create a new group skeleton
 * @param {String|null} id The 1password group UUID
 * @returns {Object} A group object
 */
function createGroupSkeleton(id, title = "Untitled Group") {
    return {
        id,
        title,
        parentID: null,
        entries: [],
        groups: []
    };
}

/**
 * Merge extracted groups and entries to form a tree
 * @param {Object} groups Groups key=>value list
 * @param {Object} entries Entries key=>value list
 * @param {Object=} currentGroup The current object being worked on
 */
function mergeItemsToTree(groups, entries, currentGroup) {
    const thisGroup = currentGroup || createGroupSkeleton(null);
    if (!currentGroup) {
        thisGroup.title = "Imported 1password vault";
    }
    Object.values(entries).forEach(function(entry) {
        if (
            (!entry.groupID && thisGroup.id === null) ||
            (entry.groupID && entry.groupID === thisGroup.id)
        ) {
            thisGroup.entries.push(entry);
        }
    });
    Object.values(groups).forEach(function(group) {
        if (group.id && group.parentID === thisGroup.id) {
            thisGroup.groups.push(mergeItemsToTree(groups, entries, group));
        }
    });
    return thisGroup;
}

module.exports = {
    convert1pifToJSON
};
