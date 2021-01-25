const crypto = require('crypto');

module.exports = function cryptus(_options) {

  const options = _options || {};
  const algorithm = options.algorithm || 'aes-256-cbc';
  const iterations = options.iterators || 100000;
  const keyLength = options.keyLength || 32;
  const ivLength = options.ivLength || 16;
  const saltLength = options.saltLength || 32;
  const digest = options.digest || 'sha512';

  function encrypt(hexKey, plain, cb) {
    const key = Buffer.from(hexKey, 'hex');
    crypto.randomBytes(ivLength, (err, iv) => {
      if (err) return cb(err);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const encrypted = cipher.update(plain, 'utf8', 'hex') + cipher.final('hex');
      const result = 'v1' + ':' + iv.toString('hex') + ':' + encrypted;
      cb(null, result);
    });
  }

  function decrypt(hexKey, token, cb) {
    const key = Buffer.from(hexKey, 'hex');
    const parts = token.split(':');
    const iv = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = cipher.update(encrypted, 'hex', 'utf8') + cipher.final('utf8');
    cb(null, result);
  }

  function createKey(text, cb) {
    crypto.randomBytes(saltLength, (err, salt) => {
      if (err) cb(err);
      crypto.pbkdf2(text, salt, iterations, keyLength, digest, (err, key) => {
        if (err) return cb(err);
        cb(null, key.toString('hex'));
      });
    });
  }

  return {
    createKey: createKey,
    encrypt: encrypt,
    decrypt: decrypt,
  };
};
