const Web3 = require("web3");

const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io")

// web3
const web3 = new Web3(provider);

module.exports.web3 = web3