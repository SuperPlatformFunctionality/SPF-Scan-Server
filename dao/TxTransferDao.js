const DataTypes = require("sequelize").DataTypes;
const Op = require("sequelize").Op;
const lindb = require("./linkDb");
const sequelize = lindb.sequelize;

const TxTransferDao = sequelize.define('TxTransferDao', {
	txHash: {
		type:DataTypes.STRING(128),
		primaryKey:true,
		field:"tx_hash"
	},
	blockNo: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"block_no"
	},
	blockHash: {
		type:DataTypes.STRING(128),
		field:"block_hash"
	},
	blockTs: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"block_ts"
	},
	addressFrom: {
		type:DataTypes.STRING(128),
		field:"address_from"
	},
	addressTo: {
		type:DataTypes.STRING(128),
		field:"address_to"
	},
	value: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"value"
	}
}, {
    // Other model options go here
    tableName: 'tx_transfer',
    timestamps: false
});

async function newTxTransferRecord(txHash,blockNo,blockHash,blockTs,addressFrom,addressTo,value,transaction) {
    let newSFModel = await TxTransferDao.create({
		txHash,blockNo,blockHash,blockTs,addressFrom,addressTo,value
    },{
        transaction:transaction,
        logging:false
    });
    let newSFObj = null;
    if(newSFModel != null) {
		newSFObj = newSFModel.toJSON();
    }
    return newSFObj;
}

async function getTxTransferByTxHash(txHash, transaction, forUpdate) {
	let whereObj = {"txHash": txHash}
	let recObj = null;
	let ttRecords = await _getTxTransferBySomeProperty(whereObj, transaction, forUpdate);
	if(ttRecords.length > 0) {
		recObj = ttRecords[0];
	}

	if(ttRecords.length > 1) {
		console.log(`warning : there is more than one tx that get hash ${txHash}`);
	}

	return recObj;
}

async function _getTxTransferBySomeProperty(whereObj, transaction, forUpdate) {
	let options = {
		logging:false
	}
	options.where = whereObj;

	if(transaction != null) {
		options.transaction = transaction;
		if(forUpdate != null) {
			options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
		}
	}

	let tgtTTModels = await TxTransferDao.findAll(options);
	let recordObjs = [];
	for(let i = 0 ; i < tgtTTModels.length; i++) {
		let tmpModel = tgtTTModels[i];
		let tmpObj = tmpModel.toJSON();
		recordObjs.push(tmpObj);
	}
	return recordObjs;
}

exports.newTxTransferRecord = newTxTransferRecord;
exports.getTxTransferByTxHash = getTxTransferByTxHash;
