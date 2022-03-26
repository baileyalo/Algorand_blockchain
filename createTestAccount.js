const algosdk = require('algosdk');
var acct = null;


acct = algosdk.generateAccount();
console.log('');
account1 = acct.addr;
console.log('Account 1 = ' + account1);
var account1_mnemonic = algosdk.secretKeyToMnemonic(acct.sk);
console.log('Account 1 Mnemonic = ' + account1_mnemonic);
var recoveredAccount1 = algosdk.mnemonicToSecretKey(account1_mnemonic);
var isValid = algosdk.isValidAddress(recoveredAccount1.addr);
console.log('Valid Address? ' + isValid);
console.log('Account successfully created.');
