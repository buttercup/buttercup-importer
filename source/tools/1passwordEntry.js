"use strict";

const ATTR_1PASS_TYPE = "ONEPASS_IMPORT_TYPE";
const ENTRY_NORMAL = /^webforms\.WebForm/i;
const ENTRY_CREDITCARD = /^wallet\.financial\.CreditCard/i;
const ENTRY_PASSWORD = /^passwords\.Password/i;
const ENTRY_LICENSE = /^wallet\.computer\.License/i;
const ENTRY_EMAIL_V2 = /^wallet\.onlineservices\.Email\.v2/i;
const ENTRY_SSN = /^wallet\.government\.SsnUS/i;
const ENTRY_ROUTER = /^wallet\.computer\.Router/i;

/**
 * Convert a 1password raw item to an entry object
 * @param {Object} rawItem Extracted 1password item
 * @returns {Object|null} The converted entry object or null if invalid
 */
function onePasswordItemToEntry(rawItem) {
    const entry = {
        groupID: rawItem.folderUuid || rawItem.typeName || null,
        title: rawItem.title || "Untitled entry",
        username: "",
        password: "",
        meta: {},
        attributes: {
            [ATTR_1PASS_TYPE]: rawItem.typeName
        }
    };
    if (rawItem.location) {
        entry.meta.url = rawItem.location;
    }
    if (testNormalEntryAndFieldsExist(rawItem)) {
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
        entry.meta["expiry-month"] = rawItem.secureContents.expiry_mm;
        entry.meta["validfrom-year"] = rawItem.secureContents.validFrom_yy;
        entry.meta["validfrom-month"] = rawItem.secureContents.validFrom_mm;
    } else if (ENTRY_PASSWORD.test(rawItem.typeName)) {
        entry.password = rawItem.secureContents.password;
    } else if (ENTRY_LICENSE.test(rawItem.typeName)) {
        if (!rawItem.secureContents.reg_code) {
            return null;
        }
        entry.password = rawItem.secureContents.reg_code;
        if (rawItem.secureContents.reg_email) {
            entry.username = rawItem.secureContents.reg_email;
        }
        if (rawItem.secureContents.reg_name) {
            entry.meta["Name"] = rawItem.secureContents.reg_name;
        }
    } else if (ENTRY_EMAIL_V2.test(rawItem.typeName)) {
        entry.username = rawItem.secureContents.pop_username;
        entry.password = rawItem.secureContents.pop_password;
        entry.meta["POP Server"] = rawItem.secureContents.pop_server;
    } else if (ENTRY_SSN.test(rawItem.typeName)) {
        entry.password = rawItem.secureContents.number;
        if (rawItem.secureContents.name) {
            entry.meta["Name"] = rawItem.secureContents.name;
        }
    } else if (ENTRY_ROUTER.test(rawItem)) {
        entry.username = entry.meta["Network"] =
            rawItem.secureContents.network_name ||
            rawItem.secureContents.network_name;
        entry.password = rawItem.secureContents.password;
        entry.meta["Security"] = rawItem.secureContents.wireless_security;
        entry.meta["Server"] = rawItem.secureContents.server;
    } else {
        return null;
    }
    return entry;
}

function testNormalEntryAndFieldsExist(rawItem) {
    return (
        ENTRY_NORMAL.test(rawItem.typeName) &&
        Array.isArray(rawItem.secureContents.fields)
    );
}

module.exports = {
    onePasswordItemToEntry
};
