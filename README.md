# Buttercup Archive Importer
Import archives from other password managers.

[![npm version](https://badge.fury.io/js/buttercup-importer.svg)](https://www.npmjs.com/package/buttercup-importer) [![minium node version](https://img.shields.io/badge/node%20version-%3E%3D%206.x-blue.svg)](https://github.com/buttercup/buttercup-importer) [![Build Status](https://travis-ci.org/buttercup/buttercup-importer.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-importer) ![npm downloads](https://img.shields.io/npm/dm/buttercup-importer.svg?maxAge=2592000)

## About
This archive importer coverts password archives from other formats to the Buttercup archive format (BCUP).

### Supported platforms
The importer requires Node **8** or higher.

### Supported password archive formats

* ![KDBX (keepass)](https://img.shields.io/badge/KDBX-Full-brightgreen.svg) KeePass 2 archives (KDBX v3 and v4)
* ![Lastpass](https://img.shields.io/badge/CSV-Full-brightgreen.svg) Lastpass archives
* ![1Password](https://img.shields.io/badge/1PIF-Most-brightgreen.svg) 1Password PIF files (exported)
* ![Buttercup](https://img.shields.io/badge/CSV-Most-brightgreen.svg) Buttercup archives (exported)
* ![CSV](https://img.shields.io/badge/CSV-None-red.svg) CSV files (general)

### Importing from 3rd-party managers

#### KeePass 2
KeePass archives for KeePass 2 can be opened using the `importFromKDBX` command. Simply pass the filename, password and destination path.

This library supports both version 3 and 4 of the KDBX format, including the newly required argon2 hashing feature.

#### 1Password
When your archive is open, choose to export all entries to 1PIF format. Provide the path and destination to the `importFrom1PIF` function.

Imported 1Password archives may lose some information regarding their type (eg. Credit cards). The 1Password Importer supports importing the following types:

* Web Forms
* Passwords
* Credit Cards
* Software Licenses
* Emails
* SSNs
* Router Passwords

#### LastPass
Lastpass credentials can be exported as CSV files, which can be imported using Buttercup importer.

#### Bitwarden
Bitwarden credentials can be exported as JSON files, which can be imported using Buttercup importer.

Imported bitwarden archives contain the username, password, the first url associated with the item, notes and any custom fields. Attachments are not currently supported.

### Importing from Buttercup exports
Exported Buttercup vaults can be re-imported into a new Vault. Take the exported CSV file and import that in Buttercup Desktop.
