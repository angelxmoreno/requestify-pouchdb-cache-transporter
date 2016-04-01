/* global module */

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));

var handleCallback = function (cb) {
    return function (err, doc) {
        if (err) {
            cb(err);
        } else if (!doc) {
            cb(new Error('404: Doc not found'));
        } else {
            cb(null, doc.response);
        }
    };
};

module.exports = function (cache_path) {
    cache_path = cache_path || './cache';
    var db = new PouchDB(cache_path);
    var cacheTransporter = {
        get: function (url, cb) {
            db.get(url, handleCallback(cb));
        },
        set: function (url, response, cb) {
            db.upsert(url, function (doc) {
                doc.response = response;
                return doc;
            }, cb);
        },
        purge: function (url, cb) {
            db.get(url,function (err, doc) {
                db.remove(doc._id, doc._rev, cb)
            });
        }
    };

    return cacheTransporter;
};