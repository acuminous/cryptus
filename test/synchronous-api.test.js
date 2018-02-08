var assert = require('assert');
var synchronousApi = require('..').synchronousApi;

describe('Synchronous API', function() {

  var cryptus = synchronousApi();

  describe('Create Key', function() {

    var keys = [];

    before(function() {
      for (var i = 0; i < 100; i++) {
        keys.push(cryptus.createKey('secret'))
      };
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

    it('should encrypt / decrypt a string with defaults', function() {
      var original = 'Why are you wearing that stupid man suit?';
      var key = cryptus.createKey('secret');

      var encrypted = cryptus.encrypt(key, original);
      assert.ok(/v1:.*:.*/.test(encrypted))

      var decrypted = cryptus.decrypt(key, encrypted);
      assert.equal(original, decrypted);
    });

    it('should encrypt / decrypt a string with options', function() {

      cryptus = synchronousApi({
        algorithm: 'camellia-256-cbc',
        iterations: 10,
        keyLength: 32,
        digest: 'sha256'
      });

      var original = 'Why are you wearing that stupid man suit?';
      var key = cryptus.createKey('secret');

      var encrypted = cryptus.encrypt(key, original);
      assert.ok(/v1:.*:.*/.test(encrypted))

      var decrypted = cryptus.decrypt(key, encrypted);
      assert.equal(original, decrypted);
    });

    it('should not result in the same encrypted value twice', function() {
      var original = 'Why are you wearing that stupid man suit?';
      var key = cryptus.createKey('secret');
      var encrypted1 = cryptus.encrypt(key, original);
      var encrypted2 = cryptus.encrypt(key, original);
      assert.notEqual(encrypted1, encrypted2);
    });

    it('should encrypt an empty string', function() {
      var original = '';
      var key = cryptus.createKey('secret');
      var encrypted1 = cryptus.encrypt(key, original);
      var encrypted2 = cryptus.encrypt(key, original);
      assert.notEqual(encrypted1, encrypted2);
    });
  });
});
