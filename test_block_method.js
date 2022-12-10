// Import the API
const web3Config = require("./service/web3Config");
const web3Instance = web3Config.web3Instance;

const polkadotJsConfig = require("./service/polkadotJsConfig");

// Known account we want to use (available on dev chain, with funds)
const Alice = '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac';

async function main () {
//    await test_connect();
//    await test_get_extrinsic_in_block();
    await test_get_events_in_block();
//    await test_get_events_in_block_02();
}

main().catch(console.error);

async function test_connect() {
    // Create the API and wait until ready
    const api = await polkadotJsConfig.getPolkadotApiObjWs();

    // Retrieve the chain & node information information via rpc calls
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
    ]);

    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
}

async function test_get_extrinsic_in_block() {
//    let api = await polkadotJsConfig.getPolkadotApiObjWs();
    let api = await polkadotJsConfig.getPolkadotApiObjHttp();
    try {
        console.log("get block");
        let blockHeight = 10090;
        let blockHashSubstrate = await api.rpc.chain.getBlockHash(blockHeight);
        let blockSubstrate = await api.rpc.chain.getBlock(blockHashSubstrate);
        console.log(blockHashSubstrate.toString(), blockSubstrate.block.header.hash.toHex());

        console.log("get events in the block", blockHeight);
        let eventsThisBlock = await api.query.system.events.at(blockHashSubstrate);

        console.log("traverse extrinsics in the block");
        let extrinsics = blockSubstrate.block.extrinsics;
        for (let index = 0 ; index < extrinsics.length ; index++ ) {
            const extrinsic = extrinsics[index];

            console.log("extrinsic:",  extrinsic.hash.toHex(), index, extrinsic.toHuman());

            const { isSigned, meta, method: { args, method, section } } = extrinsic;
            if (isSigned) { //false if signed by web3.js
                console.log(`is a signed extrinsic, signer = ${extrinsic.signer.toString()}, nonce=${extrinsic.nonce.toString()}`);
            } else {
                console.log("not a signed extrinsic");
            }

            console.log("meta:")
            console.log(meta.docs.map((d) => d.toString()).join('\n'));

            console.log("args:")
            console.log(`${section}.${method}(${args.map(
                (a) => a.toString()).join(', ')})`
            );

            console.log("event in extrinsic", index);
            let eventsThisExtrinsic = eventsThisBlock.filter(({ phase }) =>
                phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
            );

            console.log("eventsThisExtrinsic.length:", eventsThisExtrinsic.length);
            for(let j = 0;j<eventsThisExtrinsic.length;j++) {
                let { event } = eventsThisExtrinsic[j];
//                console.log("event:" , eventsThisExtrinsic[j], event);
                if (api.events.system.ExtrinsicSuccess.is(event)) {
                    const [dispatchInfo] = event.data;
                    console.log(`${section}.${method}::ExtrinsicSuccess::${JSON.stringify(dispatchInfo.toHuman())}`);
                } else if (api.events.system.ExtrinsicFailed.is(event)) {
                    const [dispatchError, dispatchInfo] = event.data;
                    let errorInfo;
                    // decode the error
                    if (dispatchError.isModule) {
                        // for module errors, we have the section indexed, lookup
                        // (For specific known errors, we can also do a check against the
                        // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
                        const decoded = api.registry.findMetaError(dispatchError.asModule);
                        errorInfo = `${decoded.section}.${decoded.name}`;
                    } else {
                        // Other, CannotLookup, BadOrigin, no extra info
                        errorInfo = dispatchError.toString();
                    }
                    console.log(`${section}.${method}::ExtrinsicFailed::${errorInfo}`);
                } else {
                    console.log("unknown event");
                }
            }
        }

    } catch (e) {
        console.log(e);
    }

}

async function test_get_tx_in_block_with_web3() {
    let blkInfoEvm = await web3Instance.eth.getBlock(10989, true);
    let allTxsThisBlock = blkInfoEvm.transactions;
    let txsCnt = allTxsThisBlock.length;
    for(let i = 0 ; i < txsCnt ; i++) {
        let tmpTx = allTxsThisBlock[i];
        console.log("Tx", tmpTx);
        let txReceipt = await web3Instance.eth.getTransactionReceipt(tmpTx.hash);
        console.log("Tx Receipt", txReceipt);
    }
}

async function test_get_events_in_block() {
    //    let api = await polkadotJsConfig.getPolkadotApiObjWs();
    let api = await polkadotJsConfig.getPolkadotApiObjHttp();
    try {
        let blockHeight = 10090;
        let blockHash = await api.rpc.chain.getBlockHash(blockHeight);
        let events = await api.query.system.events.at(blockHash);

//      console.log(events);
        for(let i = 0;i < events.length ; i++) {
            // Extract the phase, event and the event types
            const { event, phase } = events[i];
            const types = event.typeDef;

            console.log(i, phase.isApplyExtrinsic, phase.asApplyExtrinsic);
            console.log(`\t${event.section}:${event.method}::(phase=${phase.toString()})`);

            // Loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
                console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
            });
        }

    } catch (e) {
        console.log(e);
    }
}
