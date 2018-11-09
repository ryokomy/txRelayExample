const Web3 = require("web3");
const MyContractInfo = require('../../build/contracts/MyContract.json')

// provider 
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");

// web3
const web3 = new Web3(provider);

// account
const ownerPrivKey = '0x' + '1ecf00c187e29992c9e74d2ac2a1c385706835da64963bbbbd4128b8da856d0e'
const ownerAccount = web3.eth.accounts.privateKeyToAccount(ownerPrivKey)
web3.eth.accounts.wallet.add(ownerAccount); // web3.eth.accounts.wallet[0] == ownerAccount

// abi
let mycontract_abi = MyContractInfo.abi

// address
let mycontract_address = MyContractInfo.networks["5777"].address

// contract
const MyContract = new web3.eth.Contract(mycontract_abi, mycontract_address)
for(let contract of [MyContract]){
    contract.options.from = web3.eth.accounts.wallet[0].address; // default from address
    contract.options.gasPrice = '10000000000'; // default gas price in wei (10 Gwei)
    contract.options.gas = 6000000; // provide as fallback always 6M gas
}

// sleep function
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// waitCorrectNonce
let lastNonce = null
let nonce_timeout = 0
const waitCorrectNonce = async () => {
    let nonce = await web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address)
    console.log('nonce: ' + nonce)
    while(!(nonce == lastNonce + 1 || lastNonce == null || nonce_timeout == 10)) {
        await sleep(1000)
        nonce = await web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address)
        console.log('nonce in loop: ' + nonce)
        nonce_timeout = nonce_timeout + 1
    }
    lastNonce = nonce
    nonce_timeout = 0
    return nonce
}

// main process pipeline
let pipeline = async () => {
    // MonsterEditor
    console.log()

    console.log('-------------- account --------------')
    {
        {
            console.log('web3.eth.accounts.wallet[0]')
            console.log(web3.eth.accounts.wallet[0])
            console.log()
        }
    }

    console.log('-------------- MyContract call before send --------------')
    {
        {
            console.log('address')
            console.log(MyContract.options.address)
            console.log()
        }
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
    }

    console.log('-------------- MyContract send --------------')
    {
        {
            console.log('f: incrementX')
            await MyContract.methods.incrementX().send()
            .catch(err => {throw err})
            console.log()
        }
        {
            console.log('f: setAddress')
            let addr = '0xbE76704C04eb6eB0863fE45CEcf08febFac8910D';
            await MyContract.methods.setAddress(addr).send()
            .catch(err => {throw err})
            console.log()
        }
    }

    console.log('-------------- MyContract call after send --------------')
    {
        {
            console.log('address')
            console.log(MyContract.options.address)
            console.log()
        }
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
    }

}

let main = async () => {
    console.log('----------- start pipeline -----------')
    await pipeline()
    console.log('----------- finish pipeline -----------')
}

main()