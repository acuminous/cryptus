const { promiseApi: initCryptus } = require('..');
const cryptus = initCryptus();

cryptus.createKey('super secret password').then(key => {
  return cryptus.encrypt(key, 'text to be encrypted')
    .then(encrypted => {
       console.log('Encrypted', encrypted);
       return cryptus.decrypt(key, encrypted)
         .then(decrypted => {
            console.log('Decrypted', decrypted);
         });
    });
});
