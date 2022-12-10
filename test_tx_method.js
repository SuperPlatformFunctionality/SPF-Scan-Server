// Import the API
const web3Config = require("./service/web3Config");
const web3Instance = web3Config.web3Instance;

const polkadotJsConfig = require("./service/polkadotJsConfig");

async function main () {
    await test01();
}

main().catch(console.error);

// This script will listen to all GLMR transfers (Substrate & Ethereum) and extract the tx hash
// It can be adapted for Moonriver or Moonbase Alpha
async function test01() {
    // Create the provider using Moonbeam types

    const api = await polkadotJsConfig.getPolkadotApiObjWs();

    // Subscribe to finalized blocks

    let blockHeight = 209;
    let blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const [{ block }, records] = await Promise.all([
        api.rpc.chain.getBlock(blockHash),
        api.query.system.events.at(blockHash),
    ]);

    block.extrinsics.forEach((extrinsic, index) => {
        const {method: { args, method, section }} = extrinsic;
        const isEthereum = section == "ethereum" && method == "transact";
        // Gets the transaction object
        const tx = args[0];

        // Convert to the correct Ethereum Transaction format
        const ethereumTx = isEthereum &&
            ((tx.isLegacy && tx.asLegacy) ||
            (tx.isEip1559 && tx.asEip1559) ||
            (tx.isEip2930 && tx.asEip2930));

        // Check if the transaction is a transfer
        const isEthereumTransfer = ethereumTx && ethereumTx.input.length === 0 && ethereumTx.action.isCall;

        // Retrieve all events for this extrinsic
        const events = records.filter(
            ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
        );

        // This hash will only exist if the transaction was executed through Ethereum.
        let ethereumHash = "";

        if (isEthereum) {
            // Search for Ethereum execution
            events.forEach(({ event }) => {
                if (event.section == "ethereum" && event.method == "Executed") {
                    ethereumHash = event.data[2].toString();
                }
            });
        }

        // Search if it is a transfer
        events.forEach(({ event }) => {
            if (event.section == "balances" && event.method == "Transfer") {
                const from = event.data[0].toString();
                const to = event.data[1].toString();
                const balance = event.data[2].toBigInt();

                const substrateHash = extrinsic.hash.toString();

                console.log(`Transfer from ${from} to ${to} of ${balance} (block #${blockHeight})`);
                console.log(`  - Triggered by extrinsic: ${substrateHash}`);
                if (isEthereum) {
                    console.log(`  - Ethereum (isTransfer: ${isEthereumTransfer}) hash: ${ethereumHash}`);
                }
            }
        });
    });

};

