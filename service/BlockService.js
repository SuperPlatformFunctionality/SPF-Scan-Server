const MyUtils = require("../utils/MyUtils");
const moment = require("moment");
const Decimal = require("decimal.js");
const linDb = require("../dao/linkDb");
const BlockSummaryDao = require("../dao/BlockSummaryDao");
const ResponseCodeError = require("../utils/ResponseCodeError");
const ResponseCode = require("../utils/ResponseCode");


class BlockService {
	constructor() {
		this.init = this.init.bind(this);
		this.getBlockSummaryByBlockHeight = this.getBlockSummaryByBlockHeight.bind(this);
		this.getBlockSummaryByBlockHash = this.getBlockSummaryByBlockHash.bind(this);
	}

	async init() {
		let that = this;
	}

	async getBlockSummaryByBlockHeight(blockHeight) {
		if(MyUtils.isInteger(blockHeight)) {
			blockHeight = parseInt(blockHeight, 10);
		}
		let bs = await BlockSummaryDao.getBlockSummaryByBlockNo(blockHeight);
		return bs;
	}

	async getBlockSummaryByBlockHash(blockHash) {
		let bs = await BlockSummaryDao.getBlockSummaryByBlockHashEvm(blockHash);
		if(bs == null) {
			bs = await BlockSummaryDao.getBlockSummaryByBlockHashSubstrate(blockHash);
		}
		return bs;
	}

}


let bsInstance = new BlockService();
bsInstance.init();
module.exports = bsInstance;
