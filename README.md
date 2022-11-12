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

#### get block summaries (summary list)
    request: 
    POST /block/summaries
    {
        "pageIndex":1,
        "pageSize":5
    }
    
    response:
    {
        "code": "0000",
        "msg": "success",
        "data": [{
                "blockNo": 87,
                "blockHashSubstrate": "0xf119a5feb7d2f3c62e8ac9598f89443ca9b8c15d7fa0e0f2f3b31ff025a32d35",
                "blockHashEvm": "0xa8c7e216b6847eb70d81951de7ea8e678763cce37257d6121071823de9fef069",
                "validator": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
                "blockTs": 1668268814
            }, {
                "blockNo": 86,
                "blockHashSubstrate": "0x2ee6d5823a79b868538dd3da738d01abf3dc13317a4cfbe28982479e018c318e",
                "blockHashEvm": "0x320966e8536eda5ed3a7301771eda61f0ae97cb4b815278e7e4a6c067e9ec8dc",
                "validator": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
                "blockTs": 1668268808
            }, {
                "blockNo": 85,
                "blockHashSubstrate": "0x031a50123ddab32f8b255c87bb64f50d636d35c18d8c5d8787348663d45a6ad4",
                "blockHashEvm": "0xda04a9fe2b68ed031c466c64986cc4c33fcb2d1a7235234b42921ed5d62289dd",
                "validator": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
                "blockTs": 1668268802
            }, {
                "blockNo": 84,
                "blockHashSubstrate": "0x1862b66ee11ffed03ae22c7e86a7bf9c5b878c703ced6023e7c0b40ffc6034d0",
                "blockHashEvm": "0x5ec58c7ed85520a37a02eb71993f910181f5f7848c1e5eeb36e45c5dd7f73bad",
                "validator": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
                "blockTs": 1668268796
            }, {
                "blockNo": 83,
                "blockHashSubstrate": "0x0cd610f221a4a2071c3dc35216339bce99a46aea3100dec797958ed86bea1c25",
                "blockHashEvm": "0x28c11edf2fb0d1ff1d74fd512f2b7b0f27f8c809b9f78a0bd574ebb440e40386",
                "validator": "SPFT6ZmEfrbLoZgb31LTjFaLCvSA9eYSpzkt",
                "blockTs": 1668268790
            }
        ]
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
        "address" : "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC", //target SPF wallet address
        "pageIndex":0,
        "pageSize":5
    }

    response
    {
        "code": "0000",
        "msg": "success",
        "data": [
            {
                "txHash": "0x3c10f3e81a93ca53b421bea9afa71025e79d9b9526455bda4862ef0db627404a",
                "blockNo": 243,
                "blockTs": 1668269750,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm",
                "value": "200000000000000000000"
            }, {
                "txHash": "0x5e27f9522ed22ad1fd765222beecd30f42b2af6c117d27ab30c19c9e6799128e",
                "blockNo": 240,
                "blockTs": 1668269732,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFK4wda1j6tQCv1HiT7dALH3cKqnZzUyt6Z",
                "value": "230000000000000000"
            }, {
                "txHash": "0x5c0eb40dcddac80e31c7ef450b11d924d7c33312dc623eb9aa12801f3e53d2f1",
                "blockNo": 237,
                "blockTs": 1668269714,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFK4wda1j6tQCv1HiT7dALH3cKqnZzUyt6Z",
                "value": "10000000000000000000"
            }, {
                "txHash": "0xc6961bd95a6c7d87cf89dcd649a4e41843159fdd150d9105acbd1a5ef244c483",
                "blockNo": 43,
                "blockTs": 1668268550,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFK4wda1j6tQCv1HiT7dALH3cKqnZzUyt6Z",
                "value": "5000000000000000000"
            }, {
                "txHash": "0xb8761e28cfd92d668cfac2bd21b64b9af5caaa7e6bceb2486822717ea8cab576",
                "blockNo": 30,
                "blockTs": 1668268472,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFLN3jTY1S3vTFAg1sqY2n9RncaPjS3ZDyo",
                "value": "500000000000000000000"
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

### get Tx Summaries (Summary List)
    request: 
    POST /tx/list
    {
        "pageIndex":0,
        "pageSize":5
    }
    response
    {
        "code": "0000",
        "msg": "success",
        "data": [
            {
                "txHash": "0x90c1b01174f558971e230db1c3806c22c8920370fef7ec45e64ab17170699f4e",
                "blockNo": 46,
                "blockTs": 1668268568,
                "txType": "transfer",
                "addressFrom": "SPFK4wda1j6tQCv1HiT7dALH3cKqnZzUyt6Z",
                "addressTo": "SPFFDTy4snKvE6xH61UAeQx5xoG5mFhSaoTD",
                "value": "1500000000000000000"
            }, {
                "txHash": "0xc6961bd95a6c7d87cf89dcd649a4e41843159fdd150d9105acbd1a5ef244c483",
                "blockNo": 43,
                "blockTs": 1668268550,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFK4wda1j6tQCv1HiT7dALH3cKqnZzUyt6Z",
                "value": "5000000000000000000"
            }, {
                "txHash": "0x49ea0422d9a1107e0793dc29b72b385cc947926644282e2d56b45640b38dce77",
                "blockNo": 39,
                "blockTs": 1668268526,
                "txType": "transfer",
                "addressFrom": "SPFLN3jTY1S3vTFAg1sqY2n9RncaPjS3ZDyo",
                "addressTo": "SPFGyqMYJQVKjaRYKVdExFVQQzRHs2SK3u8Z",
                "value": "30000000000000000000"
            }, {
                "txHash": "0xb8761e28cfd92d668cfac2bd21b64b9af5caaa7e6bceb2486822717ea8cab576",
                "blockNo": 30,
                "blockTs": 1668268472,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFLN3jTY1S3vTFAg1sqY2n9RncaPjS3ZDyo",
                "value": "500000000000000000000"
            }, {
                "txHash": "0xb326cacb8b4966e04a4a9a1aa3f52f36ab8649e3cac740d60e0844a981ca8cca",
                "blockNo": 30,
                "blockTs": 1668268472,
                "txType": "transfer",
                "addressFrom": "SPF7bLsyFKSazEuMuVodKZfty6fFpDiwdBpC",
                "addressTo": "SPFLN3jTY1S3vTFAg1sqY2n9RncaPjS3ZDyo",
                "value": "200000000000000000000"
            }
        ]
    }
