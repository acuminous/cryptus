var crypto = require('crypto');

module.exports = function cryptus(_options) {

  var options = _options || {};
  var algorithm = options.algorithm || 'aes-256-cbc';
  var iterations = options.iterators || 100000;
  var keyLength = options.keyLength || 32;
  var ivLength = options.ivLength || 16;
  var saltLength = options.saltLength || 32;
  var digest = options.digest || 'sha512';

  function encrypt(hexKey, plain) {
    var key = Buffer.from(hexKey, 'hex');
    var iv = crypto.randomBytes(ivLength);
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var encrypted = cipher.update(plain, 'utf8', 'hex') + cipher.final('hex');
    return 'v1' + ':' + iv.toString('hex') + ':' + encrypted;
  }

  function decrypt(hexKey, token, cb) {
    var key = Buffer.from(hexKey, 'hex');
    var parts = token.split(':');
    var iv = Buffer.from(parts[1], 'hex');
    var encrypted = parts[2];
    var cipher = crypto.createDecipheriv(algorithm, key, iv);
    return cipher.update(encrypted, 'hex', 'utf8') + cipher.final('utf8');
  }

  function createKey(text, cb) {
    var salt = crypto.randomBytes(saltLength);
    var key = crypto.pbkdf2Sync(text, salt, iterations, keyLength, digest);
    return key.toString('hex');
  };

  return {
    createKey: createKey,
    encrypt: encrypt,
    decrypt: decrypt,
  };
};
