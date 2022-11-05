let Web3 = require('web3');
let	bscRpcUrl = 'http://34.170.110.92:9933';
const OPTIONS = {
    defaultBlock :"latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
}

let web3Instance = new Web3(bscRpcUrl, null, OPTIONS);
module.exports = {
    web3Instance,
}
