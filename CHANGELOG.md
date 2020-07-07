# Buttercup importer changelog

## v2.0.3
_2020-07-07_

 * **Bugfix**:
   * `ButtercupCSVImporter` not importing correctly
     * CSV item type (group/entry) not detected
     * Group ID not set
     * Group parent not set

## v2.0.2
_2020-07-06_

 * **Bugfix**
   * `ButtercupCSVImporter` not exported correctly

## v2.0.1
_2020-07-06_

 * **Bugfix**
   * `package.json` `main` points to incorrect location

## v2.0.0
_2020-05-30_

 * **Major rebuild**
 * Buttercup vault importer (.bcup)
 * All importers use classes
 * Buttercup core version 4

## v1.3.0
_2020-03-31_

 * Update all dependencies
 * **Bugfix**:
   * [#54](https://github.com/buttercup/buttercup-importer/pull/54) Fix argon2 Windows builds

## v1.2.0
_2020-02-11_

 * Generic CSV importer

## v1.1.0
_2019-11-14_

 * KDBX key file support

## v1.0.0
_2019-10-02_

 * Removed Node 6 support
 * Upgrade kdbxweb to latest version (1.5.3)
 * Support argon2 for kdbxweb and KDBX version 4

## v0.15.0
_2019-07-11_

 * Bitwarden import support

## v0.14.1
_2018-07-28_

 * Add Buttercup import support (CSV)

## v0.13.0
_2018-03-15_

 * Move `buttercup` to peerDependency

## v0.12.0
_2018-03-03_

 * Upgrade kdbxweb to latest version (1.2.2)

## v0.11.0
_2018-02-27_

 * Adds support for more 1password entry types and categories

## v0.10.0
_2018-02-26_

 * Update all dependencies

## v0.9.3
_2018-02-26_

 * Fix 1Password import of empty items (unset fields)

## v0.9.2
_2017-06-18_

 * Fix Lastpass multiline values (CSV importing)

## v0.9.1
_2017-05-27_

 * Fix Lastpass empty/non-existent notes creating blank meta values

## v0.9.0
_2017-05-27_

 * Added support for exported Lastpass archives (csv)

## v0.8.0
_2017-05-05_

 * Added support for exported 1password archives (1pif)

## v0.7.0
_2017-03-13_

 * Core update to 0.35.0
   * Fix importing for special characters
   * Archives created using encoded entry values feature

## v0.6.1
_2017-01-07_

 * Bugfix: No error thrown if Keepass export password is wrong

## v0.6.0
_2017-01-07_

 * Core @ 0.33.0
   * Archive getHistory command

## v0.5.0
_2017-01-07_

 * Update Buttercup-core to 0.32.0
 * Remove file-output for importing KDBX archives
