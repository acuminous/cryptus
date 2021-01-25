const assert = require('assert');
const pLimit = require('p-limit');
const util = require('util');
const { before, describe, it } = require('zunit');
const promiseApi = require('..').promiseApi;

if (!util.promisify) return;

describe('Promise API', () => {

  let cryptus = promiseApi();

  describe('Create Key', () => {

    let keys;

    before((h, done) => {
      const limit = pLimit(4);
      const tasks = [];
      for (let i = 0; i < 100; i++) {
        tasks.push(limit(() => {
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

    it('should not create the same key twice', () => {
      const uniqueKeys = Object.keys(keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}));

      assert.equal(uniqueKeys.length, 100);
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

      cryptus.createKey('secret')
        .then((key) => {
          cryptus.encrypt(key, original)
            .then((encrypted) => {
              assert.ok(/v1:.*:.*/.test(encrypted));
              cryptus.decrypt(key, encrypted)
                .then((decrypted) => {
                  assert.equal(original, decrypted);
                  done();
                }).catch(done);
            }).catch(done);
        }).catch(done);
    });

    it('should encrypt / decrypt a string with options', (t, done) => {

      cryptus = promiseApi({
        algorithm: 'camellia-256-cbc',
        iterations: 10,
        keyLength: 32,
        digest: 'sha256',
      });

      const original = 'Why are you wearing that stupid man suit?';

      cryptus.createKey('secret')
        .then((key) => {
          cryptus.encrypt(key, original)
            .then((encrypted) => {
              assert.ok(/v1:.*:.*/.test(encrypted));
              cryptus.decrypt(key, encrypted)
                .then((decrypted) => {
                  assert.equal(original, decrypted);
                  done();
                }).catch(done);
            }).catch(done);
        }).catch(done);
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

      cryptus.createKey('secret')
        .then((key) => {
          cryptus.encrypt(key, original)
            .then((encrypted) => {
              assert.ok(/v1:.*:.*/.test(encrypted));
              cryptus.decrypt(key, encrypted)
                .then((decrypted) => {
                  assert.equal(original, decrypted);
                  done();
                }).catch(done);
            }).catch(done);
        }).catch(done);
    });
  });
});
