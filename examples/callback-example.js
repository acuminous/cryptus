const { callbackApi: initCryptus } = require('..');
const cryptus = initCryptus();

cryptus.createKey('super secret password', (err, key) => {
  if (err) throw err;
  cryptus.encrypt(key, 'text to be encrypted', (err, encrypted) => {
     console.log('Encrypted', encrypted);
    cryptus.decrypt(key, encrypted, (err, decrypted) => {
      console.log('Decrypted', decrypted);
    });
  });
});
