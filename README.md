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
            "blockNo": 0,
            "blockHashSubstrate": "0x4d630ef06d5662369e9c61d92fd5815ad3e1ac694d8d5b5cb63422b77ba5b854",
            "blockHashEvm": "0x462dae0d52109020454e8af1d27f9bb9dbc2b6e0bdf7ae54e9114e63a9f29fec",
            "validator": "0x0000000000000000000000000000000000000000",
            "blockTs": 0
        }
    }



