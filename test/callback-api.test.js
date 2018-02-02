var assert = require('assert');
var async = require('async');
var callbackApi = require('..').callbackApi;

describe('Callback API', function() {

  var cryptus = callbackApi();

  describe('Create Key', function() {

    var keys;

    before(function(done) {
      async.timesLimit(100, 4, function(i, cb) {
        cryptus.createKey('secret', cb)
      }, function(err, _keys) {
        assert.ifError(err);
        keys = _keys;
        done();
      });
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

      cryptus.createKey('secret', function(err, key) {
        assert.ifError(err);
        cryptus.encrypt(key, original, function(err, encrypted) {
          assert.ifError(err);
          assert.ok(/v1:.*:.*/.test(encrypted))
          cryptus.decrypt(key, encrypted, function(err, decrypted) {
            assert.ifError(err);
            assert.equal(original, decrypted);
            done();
          })
        });
      });
    });

    it('should encrypt / decrypt a string with options', function(done) {

      cryptus = callbackApi({
        algorithm: 'camellia-256-cbc',
        iterations: 10,
        keyLength: 32,
        digest: 'sha256'
      });

      var original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret', function(err, key) {
        assert.ifError(err);
        cryptus.encrypt(key, original, function(err, encrypted) {
          assert.ifError(err);
          assert.ok(/v1:.*:.*/.test(encrypted))
          cryptus.decrypt(key, encrypted, function(err, decrypted) {
            assert.ifError(err);
            assert.equal(original, decrypted);
            done();
          })
        });
      });
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
            done()
          });
        });
      });
    });

    it('should encrypt an empty string', function(done) {

      var original = '';

      cryptus.createKey('secret', function(err, key) {
        assert.ifError(err);
        cryptus.encrypt(key, original, function(err, encrypted1) {
          assert.ifError(err);
          cryptus.encrypt(key, original, function(err, encrypted2) {
            assert.ifError(err);
            assert.notEqual(encrypted1, encrypted2);
            done()
          });
        });
      });
    });
  });
});
