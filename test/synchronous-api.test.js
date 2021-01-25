const assert = require('assert');
const { before, describe, it } = require('zunit');
const synchronousApi = require('..').synchronousApi;

describe('Synchronous API', () => {

  let cryptus = synchronousApi();

  describe('Create Key', () => {

    const keys = [];

    before(() => {
      for (let i = 0; i < 100; i++) {
        keys.push(cryptus.createKey('secret'));
      }
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

    it('should encrypt / decrypt a string with defaults', () => {
      const original = 'Why are you wearing that stupid man suit?';
      const key = cryptus.createKey('secret');

      const encrypted = cryptus.encrypt(key, original);
      assert.ok(/v1:.*:.*/.test(encrypted));

      const decrypted = cryptus.decrypt(key, encrypted);
      assert.equal(original, decrypted);
    });

    it('should encrypt / decrypt a string with options', () => {

      cryptus = synchronousApi({
        algorithm: 'camellia-256-cbc',
        iterations: 10,
        keyLength: 32,
        digest: 'sha256',
      });

      const original = 'Why are you wearing that stupid man suit?';
      const key = cryptus.createKey('secret');

      const encrypted = cryptus.encrypt(key, original);
      assert.ok(/v1:.*:.*/.test(encrypted));

      const decrypted = cryptus.decrypt(key, encrypted);
      assert.equal(original, decrypted);
    });

    it('should not result in the same encrypted value twice', () => {
      const original = 'Why are you wearing that stupid man suit?';
      const key = cryptus.createKey('secret');
      const encrypted1 = cryptus.encrypt(key, original);
      const encrypted2 = cryptus.encrypt(key, original);
      assert.notStrictEqual(encrypted1, encrypted2);
    });

    it('should encrypt an empty string', () => {
      const original = '';
      const key = cryptus.createKey('secret');
      const encrypted1 = cryptus.encrypt(key, original);
      const encrypted2 = cryptus.encrypt(key, original);
      assert.notStrictEqual(encrypted1, encrypted2);
    });
  });
});
