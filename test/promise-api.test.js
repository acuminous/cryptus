var assert = require('assert');
var promiseApi = require('..').promiseApi;
var pLimit = require('p-limit');
var util = require('util');

if (!util.promisify) return;

describe('Promise API', function() {

  var cryptus = promiseApi();

  describe('Create Key', function() {

    var keys;

    before(function(done) {
      var limit = pLimit(4);
      var tasks = [];
      for (var i = 0; i < 100; i++) {
        tasks.push(limit(function() {
          return cryptus.createKey('secret');
        }));
      }
      Promise.all(tasks)
        .then(_keys => {
          keys = _keys;
        })
        .then(done)
        .catch(done);
    });

    it('should not create the same key twice', function() {
      var uniqueKeys = Object.keys(keys.reduce(function(acc, key) {
        acc[key] = true;
        return acc;
      }, {}));

      assert.equal(uniqueKeys.length, 100);
    });

    it('should not create sequential keys', function() {
      const unsorted = keys.join(',');
      const sorted = keys.slice(0).sort().join(',');
      assert.notEqual(sorted, unsorted);
    });

  });

  describe('Encrypt / Decrypt', function() {

    it('should encrypt / decrypt a string with defaults', function(done) {
      var original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret')
        .then(function(key) {
          cryptus.encrypt(key, original)
          .then(function(encrypted) {
            assert.ok(/v1:.*:.*/.test(encrypted));
            cryptus.decrypt(key, encrypted)
            .then(function(decrypted) {
              assert.equal(original, decrypted);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
    });

    it('should encrypt / decrypt a string with options', function(done) {

      cryptus = promiseApi({
        algorithm: 'camellia-256-cbc',
        iterations: 10,
        keyLength: 32,
        digest: 'sha256',
      });

      var original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret')
        .then(function(key) {
          cryptus.encrypt(key, original)
          .then(function(encrypted) {
            assert.ok(/v1:.*:.*/.test(encrypted));
            cryptus.decrypt(key, encrypted)
            .then(function(decrypted) {
              assert.equal(original, decrypted);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
    });

    it('should not result in the same encrypted value twice', function(done) {

      var original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret', function(err, key) {
        assert.ifError(err);
        cryptus.encrypt(key, original, function(err, encrypted1) {
          assert.ifError(err);
          cryptus.encrypt(key, original, function(err, encrypted2) {
            assert.ifError(err);
            assert.notEqual(encrypted1, encrypted2);
            done();
          });
        });
      });
    });

    it('should encrypt an empty string', function(done) {

      var original = '';

      cryptus.createKey('secret')
        .then(function(key) {
          cryptus.encrypt(key, original)
          .then(function(encrypted) {
            assert.ok(/v1:.*:.*/.test(encrypted));
            cryptus.decrypt(key, encrypted)
            .then(function(decrypted) {
              assert.equal(original, decrypted);
              done();
            }).catch(done);
          }).catch(done);
        }).catch(done);
    });
  });
});
