const algosdk=require('algosdk');

const createAccount = function (){
    try {
        const myaccount =algosdk.generateAccount();
        console.log('');
        console.log('====================');

        console.log ('Account Address:' + myaccount.addr);
        let account_mnemonic =algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log('');
        console.log('Account Mnemonic:' + account_mnemonic);
        console.log('');
        console.log('Account has been created save account address and Mnemonic for reference');
        console.log ('====================');
        
        // The logic below prompts to fund the newly created account.
        //before sending transaction to the algorand network
        //account must be funded to cover the minimal transaction fee


        console.log ('');
        console.log(' funds must be added to your new account');
        console.log('https://dispenser.testnet.aws.algodev.network/');
        console.log('');

        return myaccount;
    }catch (err){
        console.log('error', err);
    }


};

        //client must be istantiated prior to making
        //calls to the API endpoints
        //The values for <algo-address> and <algo-token>
        //localhost port 4001

      async function firstTransaction(){
          try{
              let myAccount = createAccount();
              console.log('Press any key after the account has been funded from Algo Dispenser ');

              //application will be paused until key press.

              require('child_process').spawnSync('pause', {
                  shell:true,
                  stdio:[0,1,2],
              });
              console.log('');
              console.log('');

            // connect client 
            
              const algodToken= 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
              const algodServer= 'http://localhost';
              const algodPort= 4001;
              let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

              //check balance

              let accountInfo = await algodClient.accountInformation(myAccount.addr).do();

              console.log('Account Balance: %d microAlgos', accountInfo.amount);


              //contruct transaction

              let params = await algodClient.getTransactionParams().do();
              //comment out the nest two lines to use suggested fee

              params.fee = algosdk.ALGORAND_MIN_TX_FEE;
              params.flatFee=true;

              //reciever address is previously created testnet account

              const reciever = 'TAB6LUAJAYIBX7WBCZBVS5FLAHXELR66VK2HKERHA2HB2W46R7MXGRWMBE';

              const enc = new TextEncoder();
              const note = enc.encode ('....Welcome to Algorand testnet....');

              let amount = 1000000;
              let sender = myAccount.addr;
              let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: reciever,
                  amount: amount,
                  note: note,
                  suggestedParams: params,
              });

              //before the transaction is considered valid , it must be signed by private key
              
              //sign transaction
              let signedTxn =txn.signTxn(myAccount.sk);
              let txId = txn.txID().toString();
              console.log ('Signed Transaction with txID: %s', txId);


              //submit transaction

              await algodClient.sendRawTransaction(signedTxn).do();

              //wait for transaction confirmation

              let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

              //get completed transaction

              console.log(
                  'Transaction' + txId + 'confirmed in round' + confirmedTxn ['confirmed-round']
              );

              let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
              console.log ('==========================');
              console.log ('');
              console.log(string);
              console.log ('');

              accountInfo = await algodClient.accountInformation(myAccount.addr).do();
              console.log ('');
              console.log ('Transaction amount : %d microAlgos',confirmedTxn.txn.txn.amt);
              console.log ('');
              console.log ('Transaction fee : %d microAlgos',confirmedTxn.txn.txn.fee);
              console.log ('');
              console.log ('Transaction balance : %d microAlgos',accountInfo.amount);
             
          }catch (err){
              console.log('error', err);
          }
          process.exit();
      }  
      firstTransaction();
