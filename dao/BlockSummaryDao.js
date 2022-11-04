const DataTypes = require("sequelize").DataTypes;
const Op = require("sequelize").Op;
const lindb = require("./linkDb");
const MyUtils = require("../utils/MyUtils");
const sequelize = lindb.sequelize;
const moment =require("moment");

const BlockSummaryDao = sequelize.define('BlockSummaryDao', {
    blockNo: {
		type:DataTypes.BIGINT.UNSIGNED,
		primaryKey:true,
		field:"block_no"
    },
	blockHash: {
		type:DataTypes.STRING(128),
		field:"block_hash"
	},
    validator: {
		type:DataTypes.STRING(32),
		field:"validator"
    },
	blockTs: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"block_ts"
	},
}, {
    // Other model options go here
    tableName: 'block_summary',
    timestamps: false
});

async function newBlockSummary(blockNo, blockHash, validator, blockTs, transaction) {
    let newBSModel = await BlockSummaryDao.create({
		blockNo, blockHash, validator, blockTs
    },{
        transaction:transaction,
        logging:false
    });
    let newBSObj = null;
    if(newBSModel != null) {
		newBSObj = newBSModel.toJSON();
    }
    return newBSObj;
}

async function getBlockSummaryByBlockNo(blockNo, transaction, forUpdate) {
	let whereObj = {"blockNo": blockNo}
	return await _getBlockSummaryBySomeProperty(whereObj, transaction, forUpdate);
}

async function getBlockSummaryByBlockHash(blockHash, transaction, forUpdate) {
	let whereObj = {"blockHash": blockHash}
	return await _getBlockSummaryBySomeProperty(whereObj, transaction, forUpdate);
}

async function _getBlockSummaryBySomeProperty(whereObj, transaction, forUpdate) {
	let options = {
		logging: false
	}
	options.where = whereObj;
	if (transaction != null) {
		options.transaction = transaction;
		if (forUpdate != null) {
			options.lock = forUpdate ? transaction.LOCK.UPDATE : transaction.LOCK.SHARE;
		}
	}

	let tgtBSModel = await BlockSummaryDao.findOne(options);
	let tgtBSObj = null;
	if(tgtBSModel != null) {
		tgtBSObj = tgtBSModel.toJSON();
	}
	return tgtBSObj;
}

async function getBlockSummariesByValidator(validator, transaction, forUpdate) {
	let whereObj = {"validator": validator}
	return await _getBlockSummariesBySomeProperty(whereObj, transaction, forUpdate);
}

async function _getBlockSummariesBySomeProperty(whereObj, transaction, forUpdate) {
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

	let tgtBSModels = await BlockSummaryDao.findAll(options);
	let recordObjs = [];
	for(let i = 0 ; i < tgtBSModels.length; i++) {
		let tmpModel = tgtBSModels[i];
		let tmpObj = tmpModel.toJSON();
		recordObjs.push(tmpObj);
	}
	return recordObjs;
}


exports.newBlockSummary = newBlockSummary;
exports.getBlockSummaryByBlockNo = getBlockSummaryByBlockNo;
exports.getBlockSummaryByBlockHash = getBlockSummaryByBlockHash;
exports.getBlockSummariesByValidator = getBlockSummariesByValidator;

