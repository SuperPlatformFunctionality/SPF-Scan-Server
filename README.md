# SPF-Scan-Server

## deployment environment
- dev chain rpc : http://34.170.110.92:9933
- test env: https://api-spfscan.superpf.io

### about Chain:
#### get chain summary
    request:
    POST /chain/summary
    {
        
    }
    response
    {
        "code": "0000",
        "msg": "success",
        "data": {
            "id": 1,   //ignore
            "currentBlockNo": 15550, //current block height
            "txCount": 0,            //tx count totaly
            "accountCount": 0,       //account count totally
            "contractCount": 0,      //contract count totally
            "updateTime": "2022-11-06T03:53:15.000Z"
        }
    }


### about Block:
#### get block summary
    request: 
    POST /block/summary
    {
        "queryParam":10, // height or block hash (evm style/substrate style)
    }
    
    response:
    {
        "code": "0000",
        "msg": "success",
        "data": {
            "blockNo": 10,
            "blockHashSubstrate": "0xc01df7a61e808b51c620a2790c970f8ff479742bc8808e9009c1e509f2299fdf",
            "blockHashEvm": "0x9e3516542729d90b2325b5208ade7a124e05fd0ff88f54c3e67eabed86e5a78c",
            "validator": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
            "blockTs": 1667796224
        }
    }

### about Account
#### get account summary
    request: 
    POST /account/summary
    {
        "address":"SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt"  //target SPF wallet address
    }

    response
    {
        "code": "0000",
        "msg": "success",
        "data": {
            "accountAddress": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
            "nickName": "",
            "initBlockNo": 92,
            "balance": "0"
        }
    }

#### get account tx history
    request: 
    POST /account/tx/history
    {
        "address":"SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm" //target SPF wallet address
    }

    response
    {
        "code": "0000",
        "msg": "success",
        "data": [{
                "txHash": "0x02bf93abe2fb1c37eb08158bee6c02cdff19d02bf33b1b5c4876378b8a40be30",
                "blockNo": 92,
                "blockTs": 1667880720,
                "txType": "transfer",
                "addressFrom": "SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm",
                "addressTo": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
                "value": "100000000000000000000"
            }, {
                "txHash": "0x30530b8415b119972e0b43097b1b86f57e11f0d0833ab50aa73e3d47171d6152",
                "blockNo": 898,
                "blockTs": 1667885556,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm",
                "value": "50000000000000000000"
            }, {
                "txHash": "0x93017f69519c4b79cc49151df7aa18cc47adb13fc50f8aa53fbabd1d94260940",
                "blockNo": 65,
                "blockTs": 1667880558,
                "txType": "transfer",
                "addressFrom": "SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm",
                "addressTo": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "value": "200000000000000000000"
            }
        ]
    }

### about Tx(Transaction)
### get Tx Summary
    request: 
    POST /tx/summary
    {
        "txHash" : "0x93017f69519c4b79cc49151df7aa18cc47adb13fc50f8aa53fbabd1d94260940"
    }
    response
    {
        "code": "0000",
        "msg": "success",
        "data": {
            "txHash": "0x93017f69519c4b79cc49151df7aa18cc47adb13fc50f8aa53fbabd1d94260940",
            "blockNo": 65,
            "blockTs": 1667880558,
            "txType": "transfer",
            "addressFrom": "SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm",
            "addressTo": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
            "value": "200000000000000000000"
        }
    }
