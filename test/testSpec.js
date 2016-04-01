/* global require */

var exec = require('child_process').exec;
var db_dir = './cache-db';
var expect = require('chai').expect;
var cacheTransporter = require('../index')(db_dir);

describe('The PouchDb Cache Transport', function () {
    describe('Getter', function () {
        it('gets a 404 error when retrieving new data', function (done) {
            var key = (new Date / 1000).toString();
            cacheTransporter.get(key, function (err, response) {
                expect(response).to.not.exist;
                expect(err).to.exist;
                expect(err).to.include.key('status');
                expect(err.status).to.equal(404);
                done();
            });
        });

        it('gets the response object for stored data', function (done) {
            var key = (new Date / 1000).toString();
            var responseObj = {
                body: 'some-body-' + (new Date()).toString(),
                created: (new Date()).toString()
            };
            cacheTransporter.set(key, responseObj, function () {
                cacheTransporter.get(key, function (err, response) {
                    expect(err).to.not.exist;
                    expect(response).to.eql(responseObj);
                    done();
                });
            });
        });
    });

    describe('Setter', function () {
        it('sets data that can be retrieved', function (done) {
            var key = (new Date / 1000).toString();
            var responseObj = {
                body: 'some-body-' + (new Date()).toString(),
                created: (new Date()).toString()
            };
            cacheTransporter.set(key, responseObj, function (err, response) {
                expect(err).to.not.exist;
                expect(response).to.exist;
                expect(response).to.include.key('updated');
                expect(response.updated).to.be.true;
                cacheTransporter.get(key, function (err2, response2) {
                    expect(err2).to.not.exist;
                    expect(response2).to.eql(responseObj);
                    done();
                });
            });
        });
    });

    describe('Purger', function () {
        it('purges data to make it unretrievable', function (done) {
            var key = (new Date / 1000).toString();
            var responseObj = {
                body: 'some-body-' + (new Date()).toString(),
                created: (new Date()).toString()
            };
            cacheTransporter.set(key, responseObj, function (err, response) {
                expect(response.updated).to.be.true;
                cacheTransporter.get(key, function (err2, response2) {
                    expect(response2).to.eql(responseObj);
                    cacheTransporter.purge(key, function (err3, response3) {
                        expect(err3).to.not.exist;
                        expect(response3.ok).to.be.true;
                        cacheTransporter.get(key, function (err4, response4) {
                            expect(response4).to.not.exist;
                            expect(err4.status).to.equal(404);
                            done();
                        });
                    });
                });
            });
        });
    });
    after(function (done) {
        exec('rm -r ' + db_dir, function (err, stdout, stderr) {
            done(err, stdout);
        });
    });
});