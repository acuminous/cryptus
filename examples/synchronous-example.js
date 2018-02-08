const { synchronousApi: initCryptus } = require('..');

console.log('Synchronous Example');
console.log('-------------------');

const cryptus = initCryptus();
const key = cryptus.createKey('super secret password');

const encrypted = cryptus.encrypt(key, 'text to be encrypted');
console.log('Encrypted', encrypted);

const decrypted = cryptus.decrypt(key, encrypted);
console.log('Decrypted', decrypted, '\n');
