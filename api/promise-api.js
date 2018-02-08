var callbackApi = require('./callback-api');
var util = require('util');

module.exports = function(_options) {
  var options = _options || {};
  var promisify = options.promisify || util.promisify;
  if (!promisify) throw new Error('Please supply a promisify function');

  var cryptus = callbackApi(options);

  return {
    createKey: promisify(cryptus.createKey),
    encrypt: promisify(cryptus.encrypt),
    decrypt: promisify(cryptus.decrypt),
  };
};
