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



