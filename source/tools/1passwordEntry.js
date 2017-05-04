"use strict";

const ATTR_1PASS_TYPE = "ONEPASS_IMPORT_TYPE";
const ENTRY_NORMAL = /^webforms\.WebForm/i;
const ENTRY_CREDITCARD = /^wallet\.financial\.CreditCard/i;

function onePasswordItemToEntry(rawItem) {
    const entry = {
        groupID: rawItem.folderUuid || null,
        title: rawItem.title || "Untitled entry",
        username: "",
        password: "",
        meta: {},
        attributes: {
            [ATTR_1PASS_TYPE]: rawItem.typeName
        }
    };
    if (ENTRY_NORMAL.test(rawItem.typeName)) {
        rawItem.secureContents.fields.forEach(function(field) {
            if (field.designation === "username") {
                entry.username = field.value;
            }
            if (field.designation === "password") {
                entry.password = field.value;
            }
        });
    } else if (ENTRY_CREDITCARD.test(rawItem.typeName)) {
        entry.username = rawItem.secureContents.ccnum;
        entry.password = rawItem.secureContents.cvv;
        entry.meta.type = rawItem.secureContents.type;
        entry.meta.cardholder = rawItem.secureContents.cardholder;
        entry.meta["expiry-year"] = rawItem.secureContents.expiry_yy;
        entry.meta["expiry_month"] = rawItem.secureContents.expiry_mm;
        entry.meta["validfrom-year"] = rawItem.secureContents.validFrom_yy;
        entry.meta["validfrom-month"] = rawItem.secureContents.validFrom_mm;
    } else {
        return null;
    }
    return entry;
}

module.exports = {
    onePasswordItemToEntry
};
