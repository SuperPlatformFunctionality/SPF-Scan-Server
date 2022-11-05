let Web3 = require('web3');
const config = require('../config/index.js');
const spfRpcHttp = config.spfRpcHttp;

const OPTIONS = {
    defaultBlock :"latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
}

//let web3Instance = new Web3(spfRpcHttp, null, OPTIONS);
let web3Instance = new Web3(spfRpcHttp);
module.exports = {
    web3Instance,
}
