var crypto = require('crypto');

module.exports = function cryptus(_options) {

  var options = _options || {};
  var algorithm = options.algorithm || 'aes-256-cbc';
  var iterations = options.iterators || 100000;
  var keyLength = options.keyLength || 32;
  var ivLength = options.ivLength || 16;
  var saltLength = options.saltLength || 32;
  var digest = options.digest || 'sha512';

  function encrypt(hexKey, plain, cb) {
    var key = Buffer.from(hexKey, 'hex');
    crypto.randomBytes(ivLength, function(err, iv) {
      if (err) return cb(err);
      var cipher = crypto.createCipheriv(algorithm, key, iv);
      var encrypted = cipher.update(plain, 'utf8', 'hex') + cipher.final('hex');
      var result = 'v1' + ':' + iv.toString('hex') + ':' + encrypted;
      cb(null, result);
    });
  }

  function decrypt(hexKey, token, cb) {
    var key = Buffer.from(hexKey, 'hex');
    var parts = token.split(':');
    var iv = Buffer.from(parts[1], 'hex');
    var encrypted = parts[2];
    var cipher = crypto.createDecipheriv(algorithm, key, iv);
    var result = cipher.update(encrypted, 'hex', 'utf8') + cipher.final('utf8');
    cb(null, result);
  }

  function createKey(text, cb) {
    crypto.randomBytes(saltLength, (err, salt) => {
      if (err) cb(err);
      crypto.pbkdf2(text, salt, iterations, keyLength, digest, function(err, key) {
        if (err) return cb(err);
        cb(null, key.toString('hex'));
      });
    });
  };

  return {
    createKey: createKey,
    encrypt: encrypt,
    decrypt: decrypt,
  };
};
