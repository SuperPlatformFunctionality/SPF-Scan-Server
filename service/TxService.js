const TxRecordDao = require("../dao/TxRecordDao");


class TxService {
	constructor() {
		this.init = this.init.bind(this);
		this.getTxRecordByTxHash = this.getTxRecordByTxHash.bind(this);
		this.getTxRecords = this.getTxRecords.bind(this);
	}

	async init() {

	}

	async getTxRecordByTxHash(txHash) {
		let tx = await TxRecordDao.getTxRecordByTxHash(txHash);
		return tx;
	}

	async getTxRecords(pageIdx, pageSize) {
		let listTx = await TxRecordDao.getTxRecords(pageIdx, pageSize);
		return listTx;
	}

}


let tsInstance = new TxService();
tsInstance.init();
module.exports = tsInstance;
