const assert = require('assert');
const async = require('async');
const { before, describe, it } = require('zunit');
const callbackApi = require('..').callbackApi;

describe('Callback API', () => {

  let cryptus = callbackApi();

  describe('Create Key', () => {

    let keys;

    before((h, done) => {
      async.timesLimit(100, 4, (i, cb) => {
        cryptus.createKey('secret', cb);
      }, (err, _keys) => {
        assert.ifError(err);
        keys = _keys;
        done();
      });
    });

    it('should not create the same key twice', () => {
      const uniqueKeys = Object.keys(keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}));

      assert.strictEqual(uniqueKeys.length, 100);
    });

    it('should not create sequential keys', () => {
      const unsorted = keys.join(',');
      const sorted = keys.slice(0).sort().join(',');
      assert.notStrictEqual(sorted, unsorted);
    });

  });

  describe('Encrypt / Decrypt', () => {

    it('should encrypt / decrypt a string with defaults', (t, done) => {
      const original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret', (err, key) => {
        assert.ifError(err);
        cryptus.encrypt(key, original, (err, encrypted) => {
          assert.ifError(err);
          assert.ok(/v1:.*:.*/.test(encrypted));
          cryptus.decrypt(key, encrypted, (err, decrypted) => {
            assert.ifError(err);
            assert.strictEqual(original, decrypted);
            done();
          });
        });
      });
    });

    it('should encrypt / decrypt a string with options', (t, done) => {

      cryptus = callbackApi({
        algorithm: 'camellia-256-cbc',
        iterations: 10,
        keyLength: 32,
        digest: 'sha256',
      });

      const original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret', (err, key) => {
        assert.ifError(err);
        cryptus.encrypt(key, original, (err, encrypted) => {
          assert.ifError(err);
          assert.ok(/v1:.*:.*/.test(encrypted));
          cryptus.decrypt(key, encrypted, (err, decrypted) => {
            assert.ifError(err);
            assert.strictEqual(original, decrypted);
            done();
          });
        });
      });
    });

    it('should not result in the same encrypted value twice', (t, done) => {

      const original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret', (err, key) => {
        assert.ifError(err);
        cryptus.encrypt(key, original, (err, encrypted1) => {
          assert.ifError(err);
          cryptus.encrypt(key, original, (err, encrypted2) => {
            assert.ifError(err);
            assert.notStrictEqual(encrypted1, encrypted2);
            done();
          });
        });
      });
    });

    it('should encrypt an empty string', (t, done) => {

      const original = '';

      cryptus.createKey('secret', (err, key) => {
        assert.ifError(err);
        cryptus.encrypt(key, original, (err, encrypted1) => {
          assert.ifError(err);
          cryptus.encrypt(key, original, (err, encrypted2) => {
            assert.ifError(err);
            assert.notStrictEqual(encrypted1, encrypted2);
            done();
          });
        });
      });
    });
  });
});
