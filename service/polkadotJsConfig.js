const { ApiPromise, WsProvider, HttpProvider } = require('@polkadot/api');
const { hexToString, stringToHex } = require("@polkadot/util");
const config = require('../config/index.js');
const spfRpcHttp = config.spfRpcHttp;

let getPolkadotApiObj = async function(nodeEndpoint) {
    let provider = null;
    if(nodeEndpoint.startsWith("ws")) {
        provider = new WsProvider(nodeEndpoint);
    } else {
        provider = new HttpProvider(nodeEndpoint)
    }
    const api = await ApiPromise.create({ provider: provider });
    return api;
};

let getPolkadotApiObjHttp = async function() {
    return getPolkadotApiObj(spfRpcHttp);
}

let getPolkadotApiObjWs = async function() {
//    return getPolkadotApiObj(spfRpcWs);
    return null;
}

module.exports = {
    getPolkadotApiObjHttp,
}
