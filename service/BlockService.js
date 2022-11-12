const BlockSummaryDao = require("../dao/BlockSummaryDao");

class BlockService {
	constructor() {
		this.init = this.init.bind(this);
		this.getBlockSummaryByBlockHeight = this.getBlockSummaryByBlockHeight.bind(this);
		this.getBlockSummaryByBlockHash = this.getBlockSummaryByBlockHash.bind(this);
		this.getBlockSummaries = this.getBlockSummaries.bind(this);
	}

	async init() {
		let that = this;
	}

	async getBlockSummaryByBlockHeight(blockHeight) {
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

	async getBlockSummaries(pageIdx, pageSize) {
		let bs = await BlockSummaryDao.getBlockSummaries(pageIdx, pageSize);
		return bs;
	}

}


let bsInstance = new BlockService();
bsInstance.init();
module.exports = bsInstance;
