#!/usr/bin/env node

var callbackApi = require('..').callbackApi;
var cryptus = callbackApi();
var timeout = setTimeout(function() {}, 5000);
var key = process.argv[2];
var encrypted = process.argv[3];

if (!key) {
  console.error('Please specify a key');
  process.exit(1);
}

cryptus.decrypt(key, encrypted, (err, plain) => {
  if (err) throw err;
  console.log(plain);
  clearTimeout(timeout);
});
