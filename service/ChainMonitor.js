﻿const Decimal = require('decimal.js');
const web3Config = require("./web3Config");
const web3Instance = web3Config.web3Instance;
const myUtils = require("../utils/MyUtils");
const chainStatisticsDao = require("../dao/ChainStatisticsDao");

Decimal.set({ precision: 30 });

let travTxsFromSomeBlk = async function(blkNumberStart, blkNumberEnd) {
    console.log("[" + blkNumberStart + "-" + blkNumberEnd + "]----start----" + new Date());

    let ret = {result:false};
    try {
        let allIncomeTxs = [];
        for(let travelNo = blkNumberStart ; travelNo <= blkNumberEnd; travelNo++) {
            let blkInfo = await web3Instance.eth.getBlock(travelNo, true);
//            console.log(blkInfo);
            let allTxs = blkInfo.transactions;
            let txsCnt = allTxs.length;
            console.log("Transaction count in block " + travelNo + " : ", txsCnt);
            console.log(allTxs);
            let txsCntETH = 0;
            for(let i = 0 ; i < txsCnt ; i++) {
                let tmpTx = allTxs[i];
                //console.log(tmpTx);
                let vTxHash = tmpTx.hash;
                let vValidator = tmpTx.miner;
                let vFrom = tmpTx.from;
                let vTo = tmpTx.to;
                if(vTxHash == null || vFrom == null || vTo == null) {
                    continue;
                }
//                console.log("tmpTx", tmpTx);

                vTxHash = vTxHash.toLowerCase();
                vValidator = vValidator.toLowerCase();
                vFrom = vFrom.toLowerCase();
                vTo = vTo.toLowerCase();
//                let vValue = new Decimal(tmpTx.value.toString()).div(Math.pow(10, 18)).toFixed();
                let vValue = new Decimal(tmpTx.value.toString());
                allIncomeTxs.push({
                    txHash:vTxHash,
                    validator:vValidator,
                    from:vFrom,
                    to:vTo,
                    value:vValue}
                );
                txsCntETH++;
            }
            console.log("SPF transfer transactions count in block " + travelNo + " : ", txsCntETH);
        }
        await myUtils.sleepForMillisecond(400);

//        console.log("all income transactions:\r\n", allIncomeTxs);
        let sendSuccess = 0;
        for(let i = 0 ; i < allIncomeTxs.length ; i++) {
            let tmpIncomeItem = allIncomeTxs[i];
            try {
                let tempMsgString = JSON.stringify(tmpIncomeItem);
                sendSuccess++;
            } catch(e) {
                console.log("send msg to rabbitmq error", e);
            }
            await myUtils.sleepForMillisecond(500);
        }

        ret.result = (sendSuccess == allIncomeTxs.length);
    } catch(e) {
        console.log("traversal Txs error", e);
    }
    console.log("[" + blkNumberStart + "-" + blkNumberEnd + "]----end----" + new Date());
    return ret;
}

const BLOCK_TRAVEL_LEGHTH = 5;
let startMonitorLoop = async function() {
    let csInfo = await chainStatisticsDao.getChainStatisticsInfo();
    let curBlkNoStart = csInfo.currentBlockNo;
    let curBlkNoEnd = curBlkNoStart + BLOCK_TRAVEL_LEGHTH;
    do {
        try {
            let latestBlkNoInMainChain = await web3Instance.eth.getBlockNumber();
            if(curBlkNoEnd + 3 >= latestBlkNoInMainChain) {
                const sleepSecs = 5;
                console.log("----sleep " + sleepSecs + " seconds and waiting for ethereum produces more blocks---");
                await myUtils.sleepForMillisecond(sleepSecs * 1000);
                continue;
            }

            console.log("\r\n\r\n");
            let travelRes = await travTxsFromSomeBlk(curBlkNoStart, curBlkNoEnd);
            if(travelRes.result) {
                await chainStatisticsDao.updateCurrentBlockNoById(curBlkNoEnd);
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
