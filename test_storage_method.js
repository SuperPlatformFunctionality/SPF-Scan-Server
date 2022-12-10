// Import the API
const web3Config = require("./service/web3Config");
const web3Instance = web3Config.web3Instance;

const polkadotJsConfig = require("./service/polkadotJsConfig");

async function main () {
//    await test01();
//    await test02();
    await test03();
}

main().catch(console.error);

async function test01() {
        //let api = await polkadotJsConfig.getPolkadotApiObjWs();
    let api = await polkadotJsConfig.getPolkadotApiObjHttp();

    try {
        // retrieve Option<StakingLedger>
        const ledger = await api.query.staking.ledger('0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac');  //api.query.staking not exist when link to moonbeam
        console.log(ledger.isNone, ledger.isSome); // true, false

        // retrieve ValidatorPrefs (will yield the default value)
        const prefs = await api.query.staking.validators('0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac'); //api.query.staking not exist when link to moonbeam
//        console.log(JSON.stringify(prefs.toHuman())); // {"commission":"0"}
        console.log(prefs);
    } catch (e) {
        console.log(e);
    }
}

async function test02() {
    //let api = await polkadotJsConfig.getPolkadotApiObjWs();
    let api = await polkadotJsConfig.getPolkadotApiObjHttp();

    // Retrieves the entries for all slashes, in all eras (no arg)
    const allEntries = await api.query.staking.nominatorSlashInEra.entries(); //api.query.staking not exist when link to moonbeam

    // nominatorSlashInEra(EraIndex, AccountId) for the types of the key args
    allEntries.forEach(([{ args: [era, nominatorId] }, value]) => {
        console.log(`${era}: ${nominatorId} slashed ${value.toHuman()}`);
    });
}

async function test03() {
    //let api = await polkadotJsConfig.getPolkadotApiObjWs();
    let api = await polkadotJsConfig.getPolkadotApiObjHttp();

    let account = await api.query.balances.account("0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac");
    console.log(account.toHuman(), account.toJSON());
}