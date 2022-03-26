// In order to interact with the Algorand blockchain, you must have a funded account.
// To create a test account use the following code.


// The account object contains an address (addr) and private key (sk).
// You can also export the mnemonic to later import the account in software like AlgoSigner.


const algosdk = require('algosdk');


const createAccount = function () {
    try {
        const myaccount = algosdk.generateAccount();
        console.log('');
        console.log(
            '============================================================================================='
        );
        console.log('Account Address = ' + myaccount.addr);
        let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log('');
        console.log('Account Mnemonic = ' + account_mnemonic);
        console.log('');
        console.log(
            'Account has been created. Save the Account Address and Mnemonic for future reference.'
        );
        console.log(
            '============================================================================================='
        );
        // The code below prompts to fund the newly created account.
        // Before sending transactions to the Algorand network,
        // the account must be funded to cover the minimal transaction fees that exist on Algorand.
        // To fund the account use the Algorand TestNet faucet.
        console.log('');
        console.log(
            'Funds must be added to your new account using a Testnet Dispenser before continuing: '
        );
        console.log('https://dispenser.testnet.aws.algodev.network/ ');
        console.log('');
        console.log('');


        return myaccount;
    } catch (err) {
        console.log('err', err);
    }
};
// Client must be instantiated prior to making calls to the API endpoints.
// You must provide values for <algod-address> and <algod-token>.
// The CLI tools implement the client natively. By default, the algodToken
// for each sandbox is set to its aaa... value (64 "a"s) with server address http://localhost and port 4001.
async function firstTransaction() {
    try {
        let myAccount = createAccount();
        console.log(
            'Press any key after the account has been funded from an Algo dispenser.'
        );
        // Pause the application until key pressed.
        // Enables us to access OS functions by running any system command inside a
        // child process. Can control that process input stream and listen to its output stream.
        require('child_process').spawnSync('pause', {
            shell: true,
            stdio: [0, 1, 2],
        });
        console.log('');
        console.log('');
        // Connect your client
        const algodToken =
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const algodServer = 'http://localhost';
        const algodPort = 4001;
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


        //Check your balance
        let accountInfo = await algodClient.accountInformation(myAccount.addr).do();


        console.log('Account balance: %d microAlgos', accountInfo.amount);


        // The following code shows the creation of a payment transaction to transfer Algo tokens
        // to a different address. To construct a transaction, you need to retrieve the parameters
        // about the Algorand network first. You can choose to set a fee yourself, but
        // by default the fee is set to 1000 microAlgos (0.001 Algo).
        // Optionally you can add a message to the transaction using the note field (up to 1000 bytes).


        // Construct the transaction
        let params = await algodClient.getTransactionParams().do();
        // comment out the next two lines to use suggested fee
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;


        // receiver address is a previously created TestNet account
        const receiver =
            'VOW5M6DJSLR3WTRP5UCGFOFLMMXKY2UY6QVXM3TVEE4VXGSCOPCU7B5FJ4';
        const enc = new TextEncoder();
        const note = enc.encode('.....Welcome to Algorand Testnet.....');
        let amount = 1000000;
        let sender = myAccount.addr;
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender,
            to: receiver,
            amount: amount,
            note: note,
            suggestedParams: params,
        });


        // Before the transaction is considered valid, it must be signed by a private key.
        // Use the following code to sign the transaction.
        // Now, you can extract the transaction ID.
        // Actually, you can even extract the transaction ID before signing the transaction.
        // You'll use the txId to look up the status of the transaction in the following sections of this guide. 


        // Sign the transaction
        let signedTxn = txn.signTxn(myAccount.sk);
        let txId = txn.txID().toString();
        console.log('Signed transaction with txID: %s', txId);


        // The signed transaction can now be submitted to the network.waitForConfirmation
        // is called after the transaction is submitted to wait until the transaction
        // is broadcast to the Algorand blockchain and is confirmed.
        // The below snippet also shows how you can decode the data in the node field again to make it readable.


        // Submit the transaction
        await algodClient.sendRawTransaction(signedTxn).do();


        // Wait for transaction confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        //Get the completed Transaction
        console.log(
            'Transaction ' +
                txId +
                ' confirmed in round ' +
                confirmedTxn['confirmed-round']
        );
        let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
        console.log(
            '============================================================================================='
        );
        console.log('');
        console.log(string);
        console.log('');
        accountInfo = await algodClient.accountInformation(myAccount.addr).do();
        console.log('');
        console.log('Transaction Amount: %d microAlgos', confirmedTxn.txn.txn.amt);
        console.log('');
        console.log('Transaction Fee: %d microAlgos', confirmedTxn.txn.txn.fee);
        console.log('');
        console.log('Account: ', myAccount.addr);
        // will be 10 million - 1 million - 1 thousand microAlgos in this example
        console.log('Account balance: %d microAlgos', accountInfo.amount);
        console.log('');
    } catch (err) {
        console.log('err', err);
    }
    process.exit();
}


firstTransaction();



