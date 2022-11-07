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
            "blockHashSubstrate": "0xf1117ceb43bd56f97a7349db6470d0ef41532b9bda13490fcbcafe8c26fbb207",
            "blockHashEvm": "0xfa71a39452fd4382dd37417eccadc14684ddf4e713014abd270c8908f2ebacb6",
            "validator": "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac",
            "blockTs": 1667703589
        }
    }



