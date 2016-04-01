# requestify pouchdb cache transporter
A cache transport for requestify that uses PouchDb

## Installation
Currently, only works in node.

```sh
npm install requestify-pouchdb
```

## Setup
Require the module and pass it to the`requestify.cacheTransporter` method.

```js
var requestify = require('requestify');
requestify.cacheTransporter(require('requestify-pouchdb')());
```

## Configuration
Currently, the only option for configuration is to set the path where PouchDb will write to.

```js
var cache_dir = './cache';
var PouchdbCacheTransporter = require('requestify-pouchdb');
var cacheTransporter = new PouchdbCacheTransporter(cache_dir);
```
OR

```js
var cacheTransporter = require('requestify-pouchdb)();
```

## Tests
```js
npm test
```