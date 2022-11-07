const DataTypes = require("sequelize").DataTypes;
const linkDb = require("./linkDb");
const sequelize = linkDb.sequelize;

const AccountDao = sequelize.define('AccountDao', {
	accountAddress: {
		type:DataTypes.STRING(128),
		primaryKey:true,
		field:"account_address"
	},
	nickName: {
		type:DataTypes.STRING(32),
		field:"nick_name"
	},
	initBlockNo: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"init_block_no"
	},
	balance: {
		type:DataTypes.BIGINT.UNSIGNED,
		field:"block_ts"
	}
}, {
    // Other model options go here
    tableName: 'account',
    timestamps: false
});

async function newAccount(accountAddress, nickName, initBlockNo, transaction) {
    let newAcntModel = await AccountDao.create({
		accountAddress,nickName,initBlockNo
    },{
        transaction:transaction,
        logging:false
    });
    let newAcntObj = null;
    if(newAcntModel != null) {
		newAcntObj = newAcntModel.toJSON();
    }
    return newAcntObj;
}

async function getAccountByAddress(accountAddress, transaction, forUpdate) {
	let options = {
		logging: false
	}
	options.where = {
		accountAddress
	};
	if (transaction != null) {
		options.transaction = transaction;
		if (forUpdate != null) {
			options.lock = forUpdate ? transaction.LOCK.UPDATE : transaction.LOCK.SHARE;
		}
	}

	let tgtAcntModel = await AccountDao.findOne(options);
	let tgtAcntObj = null;
	if(tgtAcntModel != null) {
		tgtAcntObj = tgtAcntModel.toJSON();
	}
	return tgtAcntObj;
}

exports.newAccount = newAccount;
exports.getAccountByAddress = getAccountByAddress;
