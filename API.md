## Modules

<dl>
<dt><a href="#module_ButtercupImporter">ButtercupImporter</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#convert1pifToJSON">convert1pifToJSON(onePifRaw)</a> ⇒ <code>Object</code></dt>
<dd><p>Convert raw 1pif text to a JSON tree</p>
</dd>
<dt><a href="#createGroupSkeleton">createGroupSkeleton(id)</a> ⇒ <code>Object</code></dt>
<dd><p>Create a new group skeleton</p>
</dd>
<dt><a href="#mergeItemsToTree">mergeItemsToTree(groups, entries, [currentGroup])</a></dt>
<dd><p>Merge extracted groups and entries to form a tree</p>
</dd>
<dt><a href="#onePasswordItemToEntry">onePasswordItemToEntry(rawItem)</a> ⇒ <code>Object</code> | <code>null</code></dt>
<dd><p>Convert a 1password raw item to an entry object</p>
</dd>
</dl>

<a name="module_ButtercupImporter"></a>

## ButtercupImporter

* [ButtercupImporter](#module_ButtercupImporter)
    * [~BitwardenImporter](#module_ButtercupImporter.BitwardenImporter)
        * [new BitwardenImporter(data)](#new_module_ButtercupImporter.BitwardenImporter_new)
    * [~ButtercupCSVImporter](#module_ButtercupImporter.ButtercupCSVImporter)
        * [new ButtercupCSVImporter(csvData)](#new_module_ButtercupImporter.ButtercupCSVImporter_new)
    * [~ButtercupImporter](#module_ButtercupImporter.ButtercupImporter)
        * [new ButtercupImporter(sourceVault)](#new_module_ButtercupImporter.ButtercupImporter_new)
    * [~CSVImporter](#module_ButtercupImporter.CSVImporter)
        * [new CSVImporter(csvData, [name])](#new_module_ButtercupImporter.CSVImporter_new)
    * [~KDBXImporter](#module_ButtercupImporter.KDBXImporter)
        * [new KDBXImporter(kdbxDB)](#new_module_ButtercupImporter.KDBXImporter_new)
    * [~KeePass2XMLImporter](#module_ButtercupImporter.KeePass2XMLImporter)
        * [new KeePass2XMLImporter(xmlContent)](#new_module_ButtercupImporter.KeePass2XMLImporter_new)
    * [~LastPassImporter](#module_ButtercupImporter.LastPassImporter)
        * [new LastPassImporter(data)](#new_module_ButtercupImporter.LastPassImporter_new)
    * [~OnePasswordImporter](#module_ButtercupImporter.OnePasswordImporter)
        * [new OnePasswordImporter(onePIFData)](#new_module_ButtercupImporter.OnePasswordImporter_new)
        * [.export()](#module_ButtercupImporter.OnePasswordImporter+export) ⇒ <code>Promise.&lt;Vault&gt;</code>

<a name="module_ButtercupImporter.BitwardenImporter"></a>

### ButtercupImporter~BitwardenImporter
Importer for Bitwarden vaults

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.BitwardenImporter_new"></a>

#### new BitwardenImporter(data)
Create a new Bitwarden importer


| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Raw JSON data of a Bitwarden vault export |

<a name="module_ButtercupImporter.ButtercupCSVImporter"></a>

### ButtercupImporter~ButtercupCSVImporter
Importer for Buttercup CSV exports

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.ButtercupCSVImporter_new"></a>

#### new ButtercupCSVImporter(csvData)
Create a new Buttercup CSV importer


| Param | Type | Description |
| --- | --- | --- |
| csvData | <code>String</code> | Raw CSV data of a Buttercup vault export |

<a name="module_ButtercupImporter.ButtercupImporter"></a>

### ButtercupImporter~ButtercupImporter
Importer for Buttercup vaults

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.ButtercupImporter_new"></a>

#### new ButtercupImporter(sourceVault)
Create a new Buttercup importer


| Param | Type | Description |
| --- | --- | --- |
| sourceVault | <code>Vault</code> | Source Buttercup vault |

<a name="module_ButtercupImporter.CSVImporter"></a>

### ButtercupImporter~CSVImporter
Importer for CSV files

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.CSVImporter_new"></a>

#### new CSVImporter(csvData, [name])
Create a new CSV importer


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| csvData | <code>String</code> |  | The source CSV data |
| [name] | <code>String</code> | <code>Untitled CSV import</code> | Name for the imported folder |

<a name="module_ButtercupImporter.KDBXImporter"></a>

### ButtercupImporter~KDBXImporter
Importer for KDBX vaults (<= v4)

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.KDBXImporter_new"></a>

#### new KDBXImporter(kdbxDB)
Create a new KDBX importer


| Param | Type | Description |
| --- | --- | --- |
| kdbxDB | <code>kdbxweb.Kdbx</code> | KDBX database instance |

<a name="module_ButtercupImporter.KeePass2XMLImporter"></a>

### ButtercupImporter~KeePass2XMLImporter
Importer for KeePass XML exports

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.KeePass2XMLImporter_new"></a>

#### new KeePass2XMLImporter(xmlContent)
Create a new KeePass XML importer


| Param | Type | Description |
| --- | --- | --- |
| xmlContent | <code>String</code> | The XML content to import from |

<a name="module_ButtercupImporter.LastPassImporter"></a>

### ButtercupImporter~LastPassImporter
Importer for LastPass CSV dumps

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  
<a name="new_module_ButtercupImporter.LastPassImporter_new"></a>

#### new LastPassImporter(data)
Create a new LastPass importer


| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Raw CSV data of a LastPass vault export |

<a name="module_ButtercupImporter.OnePasswordImporter"></a>

### ButtercupImporter~OnePasswordImporter
Importer for 1Password vaults

**Kind**: inner class of [<code>ButtercupImporter</code>](#module_ButtercupImporter)  

* [~OnePasswordImporter](#module_ButtercupImporter.OnePasswordImporter)
    * [new OnePasswordImporter(onePIFData)](#new_module_ButtercupImporter.OnePasswordImporter_new)
    * [.export()](#module_ButtercupImporter.OnePasswordImporter+export) ⇒ <code>Promise.&lt;Vault&gt;</code>

<a name="new_module_ButtercupImporter.OnePasswordImporter_new"></a>

#### new OnePasswordImporter(onePIFData)
Constructor for the importer


| Param | Type | Description |
| --- | --- | --- |
| onePIFData | <code>String</code> | 1pif file data |

<a name="module_ButtercupImporter.OnePasswordImporter+export"></a>

#### onePasswordImporter.export() ⇒ <code>Promise.&lt;Vault&gt;</code>
Export the 1pif data to a Buttercup Vault instance

**Kind**: instance method of [<code>OnePasswordImporter</code>](#module_ButtercupImporter.OnePasswordImporter)  
**Returns**: <code>Promise.&lt;Vault&gt;</code> - A promise that resolves with a Buttercup
	Vault instance  
<a name="convert1pifToJSON"></a>

## convert1pifToJSON(onePifRaw) ⇒ <code>Object</code>
Convert raw 1pif text to a JSON tree

**Kind**: global function  
**Returns**: <code>Object</code> - Raw archive structure  

| Param | Type | Description |
| --- | --- | --- |
| onePifRaw | <code>String</code> | Exported 1PIF content |

<a name="createGroupSkeleton"></a>

## createGroupSkeleton(id) ⇒ <code>Object</code>
Create a new group skeleton

**Kind**: global function  
**Returns**: <code>Object</code> - A group object  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> \| <code>null</code> | The 1password group UUID |

<a name="mergeItemsToTree"></a>

## mergeItemsToTree(groups, entries, [currentGroup])
Merge extracted groups and entries to form a tree

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| groups | <code>Object</code> | Groups key=>value list |
| entries | <code>Object</code> | Entries key=>value list |
| [currentGroup] | <code>Object</code> | The current object being worked on |

<a name="onePasswordItemToEntry"></a>

## onePasswordItemToEntry(rawItem) ⇒ <code>Object</code> \| <code>null</code>
Convert a 1password raw item to an entry object

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>null</code> - The converted entry object or null if invalid  

| Param | Type | Description |
| --- | --- | --- |
| rawItem | <code>Object</code> | Extracted 1password item |

