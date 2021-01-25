const crypto = require('crypto');

module.exports = function cryptus(_options) {

  const options = _options || {};
  const algorithm = options.algorithm || 'aes-256-cbc';
  const iterations = options.iterators || 100000;
  const keyLength = options.keyLength || 32;
  const ivLength = options.ivLength || 16;
  const saltLength = options.saltLength || 32;
  const digest = options.digest || 'sha512';

  function encrypt(hexKey, plain) {
    const key = Buffer.from(hexKey, 'hex');
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = cipher.update(plain, 'utf8', 'hex') + cipher.final('hex');
    return 'v1' + ':' + iv.toString('hex') + ':' + encrypted;
  }

  function decrypt(hexKey, token) {
    const key = Buffer.from(hexKey, 'hex');
    const parts = token.split(':');
    const iv = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    return cipher.update(encrypted, 'hex', 'utf8') + cipher.final('utf8');
  }

  function createKey(text) {
    const salt = crypto.randomBytes(saltLength);
    const key = crypto.pbkdf2Sync(text, salt, iterations, keyLength, digest);
    return key.toString('hex');
  }

  return {
    createKey: createKey,
    encrypt: encrypt,
    decrypt: decrypt,
  };
};
