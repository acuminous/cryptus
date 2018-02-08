const { promiseApi: initCryptus } = require('..');

console.log('Async Await Example');
console.log('-------------------');

(async () => {
  const cryptus = initCryptus();
  const key = await cryptus.createKey('super secret password');

  const encrypted = await cryptus.encrypt(key, 'text to be encrypted');
  console.log('Encrypted', encrypted);

  const decrypted = await cryptus.decrypt(key, encrypted);
  console.log('Decrypted', decrypted, '\n');
})();
