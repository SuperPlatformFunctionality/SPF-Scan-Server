const Decimal = require('decimal.js');
const web3Config = require("./web3Config");
const web3Instance = web3Config.web3Instance;
const polkadotJsConfig = require("./polkadotJsConfig");
const myUtils = require("../utils/MyUtils");

const ChainStatisticsDao = require("../dao/ChainStatisticsDao");
const BlockSummaryDao = require("../dao/BlockSummaryDao");
const AccountDao = require("../dao/AccountDao");
const TxRecordDao = require("../dao/TxRecordDao");


Decimal.set({ precision: 30 });

let travTxsFromSomeBlk = async function(blkNumberStart, blkNumberEnd) {
    let blockNoTitleTip = (blkNumberStart == blkNumberEnd)?`${blkNumberStart}`:`${blkNumberStart}-${blkNumberEnd}`
    console.log("[" + blockNoTitleTip + "]----start----" + new Date());
//    console.log("[" + blkNumberStart + "-" + blkNumberEnd + "]----start----" + new Date());
    let ret = {result:false};

    let polkadotApi = await polkadotJsConfig.getPolkadotApiObjHttp();
    try {
        let allTxs = [];
        for(let travelNo = blkNumberStart ; travelNo <= blkNumberEnd; travelNo++) {

            //get block by polkadot.js
            let blockHashSubstrate = await polkadotApi.rpc.chain.getBlockHash(travelNo);
            //let blockSubstrate = await polkadotApi.rpc.chain.getBlock(blockHashSubstrate); //node not archive??
//            console.log(blockHashSubstrate.toString());
//            console.log(blockSubstrate.toString());

            //get block by web3.js
            let blkInfoEvm = await web3Instance.eth.getBlock(travelNo, true);
            if(blkInfoEvm == null) { //why get block with parameter some block no, will get null ????
                continue;
            }
            //console.log(blkInfoEvm);
            const blockHashEvm = blkInfoEvm.hash;
            const blockValidator = myUtils.transferAddressFromEthToSPF(blkInfoEvm.miner.toLowerCase());
            const ts = blkInfoEvm.timestamp;

            //update block summary records
            let bsSameNo = await BlockSummaryDao.getBlockSummaryByBlockNo(travelNo);
            if(bsSameNo == null) {
                await BlockSummaryDao.newBlockSummary(travelNo, blockHashSubstrate.toString(), blockHashEvm, blockValidator, ts);
            }

            let allTxsThisBlock = blkInfoEvm.transactions;
            let txsCnt = allTxsThisBlock.length;
            console.log("Transaction count in block " + travelNo + " : ", txsCnt);

//            console.log(allTxsThisBlock);
            let txsCntETH = 0;
            for(let i = 0 ; i < txsCnt ; i++) {
                let tmpTx = allTxsThisBlock[i];
                //console.log(tmpTx);
                let vTxHash = tmpTx.hash;
                let txReceipt = await web3Instance.eth.getTransactionReceipt(tmpTx.hash);
                let vGasPrice = tmpTx.gasPrice;
                let vGasLimit = tmpTx.gas;
                let vGasUsed = txReceipt.gasUsed;
                let vTxFee = new Decimal(vGasPrice).mul(new Decimal(vGasUsed)).toFixed();

                let vNonce = tmpTx.nonce;
                let vFrom = myUtils.transferAddressFromEthToSPF(tmpTx.from.toLowerCase());
                let vTo = myUtils.transferAddressFromEthToSPF(tmpTx.to.toLowerCase());
                if(vTxHash == null || vFrom == null || vTo == null) {
                    continue;
                }
//                console.log("tmpTx", tmpTx);

                vTxHash = vTxHash.toLowerCase();
//                let vValue = new Decimal(tmpTx.value.toString()).div(Math.pow(10, 18)).toFixed();
                let vValue = new Decimal(tmpTx.value.toString()).toString();
                allTxs.push({
                    blockNo:travelNo,
                    txHash:vTxHash,
                    timestamp:ts,
                    blockHashSubstrate:blockHashSubstrate,
                    blockHashEvm:blockHashEvm,
                    from:vFrom,
                    to:vTo,
                    value:vValue,
                    nonce:vNonce,
                    gasPrice:vGasPrice,
                    gasLimit:vGasLimit,
                    gasUsed:vGasUsed,
                    txFee:vTxFee}
                );
                txsCntETH++;
            }
            console.log("SPF transfer transactions count in block " + travelNo + " : ", txsCntETH);
        }

        let txCountAdded = 0;
        let acntCountAdded = 0;
        for(let i = 0 ; i < allTxs.length ; i++) {
            let tmpTx = allTxs[i];
            try {
                console.log("do new tx record");
//                let tempMsgString = JSON.stringify(tmpTx);
                await TxRecordDao.newTxRecord(tmpTx.txHash, tmpTx.blockNo,
                                            tmpTx.timestamp, "transfer",
                                            tmpTx.from, tmpTx.to, new Decimal(tmpTx.value).toFixed(),
                                            tmpTx.nonce, tmpTx.gasPrice, tmpTx.gasLimit, tmpTx.gasUsed, tmpTx.txFee);
                txCountAdded++;

                console.log("do new account record");
                acntCountAdded += (await newAccountToDB(tmpTx.from, tmpTx.blockNo) ? 1:0);
                acntCountAdded += (await newAccountToDB(tmpTx.to, tmpTx.blockNo) ? 1: 0);
            } catch(e) {
                console.log(e);
            }
        }

        chainStatistics.currentBlockNo = blkNumberStart;
        if(acntCountAdded > 0) {
            chainStatistics.accountCount += acntCountAdded;
            await ChainStatisticsDao.updateAccountCount(chainStatistics.accountCount);
        }
        if(txCountAdded > 0) {
            chainStatistics.txCount += txCountAdded;
            await ChainStatisticsDao.updateTxCount(chainStatistics.txCount);
        }
        ret.result = true;
//        console.log(chainStatistics);
    } catch(e) {
        console.log("traversal Txs error", e);
    }

    console.log("[" + blockNoTitleTip + "]----end----" + new Date());
    return ret;
}

let newAccountToDB = async function(newAddress, blockNo) {
    let ret = false;
    let newAcnt = await AccountDao.getAccountByAddress(newAddress);
    if(newAcnt == null) {
        await AccountDao.newAccount(newAddress, "", blockNo);
        ret = true;
    }
    return ret;
}

let chainStatistics = {
    currentBlockNo:0,
    txCount:0,
    accountCount:0,
    contractCount:0
};
const BLOCK_TRAVEL_LEGHTH = 1;
let startMonitorLoop = async function() {
    chainStatistics = await ChainStatisticsDao.getChainStatisticsInfo();
    let curBlkNoStart = chainStatistics.currentBlockNo;
    let curBlkNoEnd = curBlkNoStart + BLOCK_TRAVEL_LEGHTH;
    do {
        try {
            let latestBlkNoInMainChain = await web3Instance.eth.getBlockNumber();
            if(curBlkNoEnd + 1 >= latestBlkNoInMainChain) {
                const sleepSecs = 3;
                console.log("----sleep " + sleepSecs + " seconds and waiting for ethereum produces more blocks---");
                await myUtils.sleepForMillisecond(sleepSecs * 1000);
                continue;
            }

            console.log("\r\n\r\n");
            let travelRes = await travTxsFromSomeBlk(curBlkNoStart, curBlkNoEnd);
            if(travelRes.result) {
                await ChainStatisticsDao.updateCurrentBlockNo(curBlkNoEnd);

                curBlkNoStart = curBlkNoEnd + 1;
                curBlkNoEnd = curBlkNoEnd + BLOCK_TRAVEL_LEGHTH;
            } else {
                console.log("[in startMonitorLoop] travTxsFromSomeBlk return false...");
                await myUtils.sleepForMillisecond(2000);
            }
            console.log("\r\n\r\n");
        } catch(e) {
            console.error("[in startMonitorLoop] exception:", e);
            await myUtils.sleepForMillisecond(2000);
        }
    } while(running);
}

//switch
let running = false;
exports.startMonitor = async function () {
    if(running) {
        return;
    }
    console.log("monitor start");
    running = true;
    await startMonitorLoop();
    running = false;
    console.log("monitor stop");
}
exports.stopMonitor = async function() {
    running = false;
}

exports.getChainStatistics = async function() {
    return chainStatistics;
};
