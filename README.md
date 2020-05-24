# Buttercup Vault Importer
> Import vaults from other password managers

[![npm](https://img.shields.io/npm/v/@buttercup/importer?color=green&label=%40buttercup%2Fimporter)](https://www.npmjs.com/package/@buttercup/importer) [![minium node version](https://img.shields.io/badge/node%20version-%3E%3D%208.x-blue.svg)](https://github.com/buttercup/buttercup-importer) [![Build Status](https://travis-ci.org/buttercup/buttercup-importer.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-importer) ![npm downloads](https://img.shields.io/npm/dm/buttercup-importer.svg?maxAge=2592000)

## About

This vault importer coverts password vaults from other formats to the Buttercup vault format (BCUP).

### Usage

This library is not intended to be used as a standalone application. Its functionality is available via the Buttercup Desktop applications.

You can of course use the importer in your own projects, by importing the individual importers.

Eg.

```javascript
const { KDBXImporter } = require("@buttercup/importer");

KDBXImporter.loadFromFile("...");
```

Check out the [API documentation](API.md).

### Supported platforms
The importer requires Node **8** or higher.

### Supported password archive formats

* ![KDBX (keepass)](https://img.shields.io/badge/KDBX-Full-brightgreen.svg) KeePass 2 archives (KDBX v3 and v4)
* ![Lastpass](https://img.shields.io/badge/CSV-Full-brightgreen.svg) Lastpass archives
* ![1Password](https://img.shields.io/badge/1PIF-Most-brightgreen.svg) 1Password PIF files (exported)
* ![Buttercup](https://img.shields.io/badge/CSV-Most-brightgreen.svg) Buttercup archives (exported)
* ![CSV](https://img.shields.io/badge/CSV-Basic-brightgreen.svg) CSV files (generic)

### Importing from 3rd-party managers

#### KeePass

KeePass vaults can be imported using either of the 2 supported importers:

 * KeePass XML (version 2) - `KeePass2XMLImporter`
 * KDBX vaults (up to, and including, version 4) - `KDBXImporter`

This library supports both version 3 and 4 of the KDBX format, including the newly required argon2 hashing feature. Key files are also supported.

#### 1Password

1Password vaults can be imported from `1pif` directories using the `OnePasswordImporter` module.

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

### Buttercup

Buttercup vaults can be imported using the `ButtercupImporter`.

### Importing from Buttercup exports

Exported Buttercup vaults can be re-imported into a new Vault. Take the exported CSV file and import that in Buttercup Desktop.
