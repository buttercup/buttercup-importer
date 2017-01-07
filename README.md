# Buttercup Archive Importer
Import archives from other password managers.

[![Build Status](https://travis-ci.org/perry-mitchell/buttercup-importer.svg?branch=master)](https://travis-ci.org/perry-mitchell/buttercup-importer)

## About
This archive importer coverts password archives from other formats to the Buttercup archive format (BCUP).

### Supported platforms
The importer requires NodeJS **v4** or above.

### Supported password archive formats

* ![KDBX (keepass)](https://img.shields.io/badge/KDBX-Full-brightgreen.svg) KeePass 2 archives
* ![1Password](https://img.shields.io/badge/1PIF-Pending-yellow.svg) 1Password PIF files (exported)
* ![CSV](https://img.shields.io/badge/CSV-None-red.svg) CSV files (exported)

### Importing from 3rd-party managers

#### KeePass 2

KeePass archives for KeePass 2 can be opened using the `importFromKDBX` command. Simply pass the filename, password and destination path.

#### 1Password

When your archive is open, choose to export all entries to 1PIF format. Provide the path and destination to the `importFrom1PIF` function.

#### LastPass

_Coming soon_
