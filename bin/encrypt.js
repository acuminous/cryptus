#!/usr/bin/env node

var callbackApi = require('..').callbackApi;
var cryptus = callbackApi();
var timeout = setTimeout(function() {}, 5000);
var key = process.argv[2];
var plain = process.argv[3];

if (!key) {
  console.error('Please specify a key');
  process.exit(1);
}

cryptus.encrypt(key, plain, (err, encrypted) => {
  if (err) throw err;
  console.log(encrypted);
  clearTimeout(timeout);
});
