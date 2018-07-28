const fs = require("fs");
const pify = require("pify");
const { Archive, Group } = require("buttercup");
const csvparse = require("csv-parse/lib/sync");

const NON_COPY_KEYS = ["id", "title"];
const ROOT_GROUP_ID = "0";

function importFromButtercup(bcupCSVPath) {
    return pify(fs.readFile)(bcupCSVPath, "utf8").then(contents => {
        const archive = new Archive();
        csvparse(contents, { columns: true }).forEach(bcupItem => {
            const {
                ["!group_id"]: groupID,
                ["!group_name"]: groupName
            } = bcupItem;
            let group = archive.findGroupByID(groupID);
            if (!group) {
                group = Group.createNew(archive, ROOT_GROUP_ID, groupID);
            }
            group.setTitle(groupName);
            const entry = group.createEntry(bcupItem.title);
            Object.keys(bcupItem)
                .filter(key => /^\!.+/.test(key) === false)
                .filter(key => NON_COPY_KEYS.indexOf(key) === -1)
                .forEach(key => {
                    entry.setProperty(key, bcupItem[key]);
                });
        });
        return archive;
    });
}

module.exports = importFromButtercup;
