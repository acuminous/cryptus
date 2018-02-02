#!/usr/bin/env node

var callbackApi = require('..').callbackApi;
var cryptus = callbackApi();
var timeout = setTimeout(function() {}, 5000);
var passphrase = process.argv[2];

if (!passphrase) {
  console.error('Please specify a passphrase');
  process.exit(1);
}

cryptus.createKey(passphrase, (err, key) => {
  if (err) throw err;
  console.log(key);
  clearTimeout(timeout);
});
