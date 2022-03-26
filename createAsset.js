// Retrieve the token, server, port values

const algosdk = require('algosdk');

// Sandbox
const token =
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const server = 'http://localhost';
const port = 4001;

// Print the created asset for account and ID
const printCreatedAsset = async function (algodclient, account, assetid) {
	let accountInfo = await algodclient.accountInformation(account).do();
	for (i = 0; i < accountInfo['created-assets'].length; i++) {
		let inspectedAsset = accountInfo['created-assets'][i];
		if (inspectedAsset['index'] == assetid) {
			console.log('Asset ID = ' + inspectedAsset['index']);
			let myparms = JSON.stringify(inspectedAsset['params'], undefined, 2);
			console.log('parms = ' + myparms);
			break;
		}
	}
};

const printAssetHolding = async function (algodclient, account, assetid) {
	let accountInfo = await algodclient.accountInformation(account).do();
	for (i = 0; i < accountInfo['assets'].length; i++) {
		let inspectedAsset = accountInfo['assets'][i];
		if (inspectedAsset['asset-id'] == assetid) {
			console.log('Asset ID = ' + inspectedAsset['index']);
			let myassetholding = JSON.stringify(inspectedAsset, undefined, 2);
			console.log('assetholdinginfo = ' + myassetholding);
			break;
		}
	}
};

// Here you would paste the mnemonic for the 3 previously generated accounts
var account1_mnemonic =
	'pride lyrics dry erase west vivid target seminar act bread orphan kiwi few increase relax blind width universe hill gather egg slim leader abstract copper';
var account2_mnemonic =
	'buyer supreme hurdle quit kitchen make just notice claw answer grab sound today cargo sun only stem surge spring gentle rely spin chase above patient';
var account3_mnemonic =
	'venture drift decrease plastic high squeeze typical market bachelor gauge steel hip local enjoy require sock above fly keen arctic lion split elevator absorb fox';
var recoveredAccount1 = algosdk.mnemonicToSecretKey(account1_mnemonic);
var recoveredAccount2 = algosdk.mnemonicToSecretKey(account2_mnemonic);
var recoveredAccount3 = algosdk.mnemonicToSecretKey(account3_mnemonic);
console.log('Account 1: ' + recoveredAccount1.addr);
console.log('Account 2: ' + recoveredAccount2.addr);
console.log('Account 3: ' + recoveredAccount3.addr);

// Instantiate the algod wrapper
let algodclient = new algosdk.Algodv2(token, server, port);

(async () => {
	// Asset creation
	let params = await algodclient.getTransactionParams().do();
	params.fee = 1000;
	params.flatFee = true;
	console.log(params);
	// the 'note' is arbitrary data to be stored in the transaction
	let note = undefined;
	// The following parameters are asset specific:
	let addr = recoveredAccount1.addr;
	// Will user accounts need to be unfrozen before transacting?
	let defaultFrozen = false;
	// number of decimals for asset unit
	let decimals = 0;
	// total amount of asset
	let totalIssuance = 1000000;
	// asset symbol
	let unitName = 'SKY';
	// asset name
	let assetName = 'Blue Sky Token';
	// optional string pointing to a URL relating to the asset
	let assetURL = 'https://www.sky.coin';
	// optional hash commitment relating to the asset (32 char length)
	let assetMetadataHash = '';
	// The following parameters are the only ones that can be changed by the manager.
	// Specified address can change reserve, freeze, clawback, and the asset manager.
	let manager = recoveredAccount2.addr;
	let reserve = recoveredAccount2.addr;
	// freeze: address can freeze or unfreeze user asset holdings
	let freeze = recoveredAccount2.addr;
	// clawback: address can revoke user assets and send them to other addresses.
	let clawback = recoveredAccount2.addr;

	// Sign and broadcast 'txn' allows 'addr' to create an asset.
	let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
		addr,
		note,
		totalIssuance,
		decimals,
		defaultFrozen,
		manager,
		reserve,
		freeze,
		clawback,
		unitName,
		assetName,
		assetURL,
		assetMetadataHash,
		params
	);

	let rawSignedTxn = txn.signTxn(recoveredAccount1.sk);
	let tx = await algodclient.sendRawTransaction(rawSignedTxn).do();

	let assetID = null;
	// wait for the transaction to be confirmed
	const ptx = await algosdk.waitForConfirmation(algodclient, tx.txId, 4);
	// get new asset's information from the asset creator account.
	assetID = ptx['asset-index'];
	// get the completed transaction
	console.log(
		'Transaction ' + tx.txId + ' confirmed in round ' + ptx['confirmed-round']
	);

	await printCreatedAsset(algodclient, recoveredAccount1.addr, assetID);
	await printAssetHolding(algodclient, recoveredAccount1.addr, assetID);
})().catch((e) => {
	console.log(e);
	console.trace();
});
