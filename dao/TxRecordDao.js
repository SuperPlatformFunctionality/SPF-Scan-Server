const DataTypes = require("sequelize").DataTypes;
const Op = require("sequelize").Op;
const linkDb = require("./linkDb");
const sequelize = linkDb.sequelize;

const TxRecordDao = sequelize.define('TxRecordDao', {
	id: {
		type:DataTypes.BIGINT.UNSIGNED,
		primaryKey:true,
		autoIncrement:true,
		field:"id"
	},
	txHash: {
		type:DataTypes.STRING(128),
		field:"tx_hash"
	},
	blockNo: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"block_no"
	},
	blockTs: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"block_ts"
	},
	txType: {
		type:DataTypes.STRING(32),
		field:"tx_type"
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
		type:DataTypes.STRING(32),
		field:"value"
	}
}, {
    // Other model options go here
    tableName: 'tx_record',
    timestamps: false
});

async function newTxRecord(txHash,blockNo,blockTs,txType,addressFrom,addressTo,value,transaction) {
    let newSFModel = await TxRecordDao.create({
		txHash,blockNo,blockTs,txType,addressFrom,addressTo,value
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

async function getTxRecordByTxHash(txHash, transaction, forUpdate) {
	let whereObj = {"txHash": txHash}
	let recObj = null;
	let ttRecords = await _getTxRecordsBySomeProperty(whereObj, 0, 0, transaction, forUpdate);
	if(ttRecords.length > 0) {
		recObj = ttRecords[0];
	}

	if(ttRecords.length > 1) {
		console.log(`warning : there is more than one tx that get hash ${txHash}`);
	}

	return recObj;
}

async function getTxRecords(pageIdx, pageSize, transaction, forUpdate) {
	let whereObj =  {}
	let ttRecords = await _getTxRecordsBySomeProperty(whereObj, pageIdx, pageSize, transaction, forUpdate);
	return ttRecords;
}

async function getTxRecordsByAccount(accountAddress, pageIdx, pageSize, transaction, forUpdate) {
	let whereObj =  {
		[Op.or]: [
			{ addressFrom: accountAddress },
			{ addressTo: accountAddress }
		]
	}
	let ttRecords = await _getTxRecordsBySomeProperty(whereObj, pageIdx, pageSize, transaction, forUpdate);
	return ttRecords;
}

async function _getTxRecordsBySomeProperty(whereObj, pageIdx, pageSize, transaction, forUpdate) {
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
	options.order = [["id", "DESC"]]

	if(pageIdx != null && pageSize != null && pageSize > 0) {
		options.offset = pageSize * pageIdx;
		options.limit = pageSize;
	}

	let tgtTTModels = await TxRecordDao.findAll(options);
	let recordObjs = [];
	for(let i = 0 ; i < tgtTTModels.length; i++) {
		let tmpModel = tgtTTModels[i];
		let tmpObj = tmpModel.toJSON();
		recordObjs.push(tmpObj);
	}
	return recordObjs;
}

exports.newTxRecord = newTxRecord;
exports.getTxRecordByTxHash = getTxRecordByTxHash;
exports.getTxRecords = getTxRecords;
exports.getTxRecordsByAccount = getTxRecordsByAccount;
