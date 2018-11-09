const request = require('request');
const util = require('util');
request.post = util.promisify(request.post)

const base_url = 'http://localhost:8080'

async function post(api, form) {
    let headers = {
        'Content-Type':'application/json'
    }

    var options = {
        url: base_url + api,
        headers: headers,
        json: true,
        form: form
    }

    let result = await request.post(options);
    if(result.error) {
        console.log('game server error: ' + base_url + api)
        return result.error;
    }
    else if (result.body) {
        console.log('game server done: ' + base_url + api)
        return result.body
    }
}

// web3 *********************************************************************************
const Web3 = require("web3");
const MyContractInfo = require('../../build/contracts/MyContract.json')

// provider 
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");

// web3
const web3 = new Web3(provider);

// account
const ownerPrivKey = '1ecf00c187e29992c9e74d2ac2a1c385706835da64963bbbbd4128b8da856d0e'
const ownerAccount = web3.eth.accounts.privateKeyToAccount('0x' + ownerPrivKey)
web3.eth.accounts.wallet.add(ownerAccount); // web3.eth.accounts.wallet[0] == ownerAccount

// abi
let mycontract_abi = MyContractInfo.abi

// address
let mycontract_address = MyContractInfo.networks["5777"].address

// contract
const MyContract = new web3.eth.Contract(mycontract_abi, mycontract_address)
// **************************************************************************************


async function postTxRelay() {
    let api = '/txRelay'

    console.log('f: setAddress')
    let addr = '0x452E251e92a10D81d135c056eE7ED3E4A47cD65B';
    let txData = MyContract.methods.setAddress(addr).encodeABI()
    // let txData = MyContract.methods.incrementX().encodeABI()
    console.log(txData)

    let tx = {
        nonce: await web3.eth.getTransactionCount(ownerAccount.address),
        from: ownerAccount.address,
        gasPrice: '10000000000',
        gas:6000000,
        data: txData
    }
    let signedTx = await web3.eth.accounts.signTransaction(tx, ownerAccount.privateKey)

    let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    console.log(receipt)

    {
        console.log('f: x')
        let x = await MyContract.methods.x().call()
        .catch(err => {throw err})
        console.log(`x = ${x}`)
        console.log()
    }
    {
        console.log('f: addr')
        let addr = await MyContract.methods.addr().call()
        .catch(err => {throw err})
        console.log(`addr = ${addr}`)
        console.log()
    }
    {
        console.log('f: sender')
        let sender = await MyContract.methods.sender().call()
        .catch(err => {throw err})
        console.log(`sender = ${sender}`)
        console.log()
    }

    // let form = {
    //     tx: 'test string'
    // }

    // let result = await post(api, form)
    // .catch(err => {
    //     console.error(err)
    // })

    // return result
}

async function test() {
    let result = await postTxRelay()
    .catch(err => {
        console.error(err)
    })
    console.log(result)
    return
}

test()