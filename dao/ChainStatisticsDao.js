const DataTypes = require("sequelize").DataTypes;
const Op = require("sequelize").Op;
const lindb = require("./linkDb");
const sequelize = lindb.sequelize;

const ChainStatisticsDao = sequelize.define('ChainStatisticsDao', {
    id: {
		type:DataTypes.INTEGER,
		primaryKey:true,
		field:"id",
		autoIncrement:true,
    },
	currentBlockNo: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"current_block_no"
	},
	txCount: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"tx_count"
	},
	accountCount: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"account_count"
	},
	contractCount: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"contract_count"
	},
	updateTime: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"update_time"
	}
}, {
    // Other model options go here
    tableName: 'chain_statistics',
    timestamps: false
});

async function _createNftSaleFreeRecord(transaction) {
    let newSFModel = await ChainStatisticsDao.create({
		currentBlockNo:0,
		txCount:0,
		accountCount:0,
		contractCount:0
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

async function getChainStatisticsInfo(transaction, forUpdate) {
	let options = {
		logging:false
	}
	options.where = {};

	if(transaction != null) {
		options.transaction = transaction;
		if(forUpdate != null) {
			options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
		}
	}

	let tgtRecordModels = await ChainStatisticsDao.findAll(options);
	let recordObjs = [];
	for(let i = 0 ; i < tgtRecordModels.length; i++) {
		let tmpModel = tgtRecordModels[i];
		let tmpObj = tmpModel.toJSON();
		recordObjs.push(tmpObj);
	}

	let retCs = null;
	if(recordObjs.length == 0) {
		retCs = _createNftSaleFreeRecord(transaction);
	} else {
		retCs = recordObjs[0];
	}

	if(recordObjs.length > 1) {
		console.log("warning : ChainStatisticsDao get more than one record...");
	}

	return retCs;
}

let recId = null;

async function updateCurrentBlockNoById(newCurrentBlockNo, transaction) {
	return _updateSomePropertyById("currentBlockNo", newCurrentBlockNo, transaction);
}

async function updateTxCountById(txCount, transaction) {
	return _updateSomePropertyById("txCount", txCount, transaction);
}
async function updateNewAccountCountById(id, newAccountCount, transaction) {
	return _updateSomePropertyById(id, "accountCount", newAccountCount, transaction);
}
async function updateContractCountById( newContractCount, transaction) {
	return _updateSomePropertyById("contractCount", newContractCount, transaction);
}

async function _updateSomePropertyById(propertyName, propertyValue, transaction) {
	if(recId == null) {
		let rec = await getChainStatisticsInfo(transaction);
		recId = rec.id;
	}

	let updateObj = {};
	updateObj[propertyName] = propertyValue;
	let retArray = await ChainStatisticsDao.update(updateObj, {
		where:{
			id: recId
		},
		transaction:transaction,
		logging:false
	});
	let affectedRow = retArray[0];
	if(affectedRow > 1) {
		console.log("update multiple record's status, it is impossible");
	}
	return true;
}

async function initChainStatisticsDao() {
	if(recId == null) {
		let rec = await getChainStatisticsInfo();
		recId = rec.id;
	}
}

exports.getChainStatisticsInfo = getChainStatisticsInfo;
exports.updateCurrentBlockNoById = updateCurrentBlockNoById;
exports.updateTxCountById = updateTxCountById;
exports.updateNewAccountCountById = updateNewAccountCountById;
exports.updateContractCountById = updateContractCountById;
exports.initChainStatisticsDao = initChainStatisticsDao;
