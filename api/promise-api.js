const callbackApi = require('./callback-api');
const util = require('util');

module.exports = function(_options) {
  const options = _options || {};
  const promisify = options.promisify || util.promisify;
  if (!promisify) throw new Error('Please supply a promisify function');

  const cryptus = callbackApi(options);

  return {
    createKey: promisify(cryptus.createKey),
    encrypt: promisify(cryptus.encrypt),
    decrypt: promisify(cryptus.decrypt),
  };
};
