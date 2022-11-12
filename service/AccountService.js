const AccountDao = require("../dao/AccountDao");
const TxRecordDao = require("../dao/TxRecordDao");

class AccountService {
	constructor() {
		this.init = this.init.bind(this);
		this.getAccountSummary = this.getAccountSummary.bind(this);
		this.getTxRecordsByAccount = this.getTxRecordsByAccount.bind(this);
	}

	async init() {

	}

	async getAccountSummary(address) {
		let tx = await AccountDao.getAccountByAddress(address);
		return tx;
	}

	async getTxRecordsByAccount(accountAddress, pageIdx, pageSize) {
		let tx = await TxRecordDao.getTxRecordsByAccount(accountAddress, pageIdx, pageSize);
		return tx;
	}

}


let acntInstance = new AccountService();
acntInstance.init();
module.exports = acntInstance;
