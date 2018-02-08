const { callbackApi: initCryptus } = require('..');
const cryptus = initCryptus();

console.log('Callback Example');
console.log('----------------');

cryptus.createKey('super secret password', (err, key) => {
  if (err) throw err;
  cryptus.encrypt(key, 'text to be encrypted', (err, encrypted) => {
     console.log('Encrypted', encrypted);
    cryptus.decrypt(key, encrypted, (err, decrypted) => {
      console.log('Decrypted', decrypted, '\n');
    });
  });
});
