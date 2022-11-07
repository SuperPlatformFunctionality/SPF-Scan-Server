const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const blockService = require("../service/BlockService");
const MyUtils = require("../utils/MyUtils");
const Decimal = require("decimal.js");

class BlockController extends BaseComponent {

	constructor() {
		super();
		this.queryBlockSummary = this.queryBlockSummary.bind(this);
	}

	isBlockHash(blockHashStr) {
		if(!blockHashStr.startsWith("0x")) {
			blockHashStr = "0x" + blockHashStr;
		}
		return (blockHashStr.length == 66); //"0x" + 64bit
	}

	async queryBlockSummary(req, res, next) {
		let that = this;
		let resJson = null;
		let queryParam = req.body["queryParam"];
		try {
			let retData = null;
			if(typeof queryParam === 'number' || typeof queryParam === 'bigint') {
				retData = await blockService.getBlockSummaryByBlockHeight(queryParam);
			} else if(typeof queryParam === 'string') {
				queryParam = queryParam.trim().toLowerCase();
				let tmp = new Decimal(queryParam);
				if(!tmp.isNaN() && tmp.isInteger()) {
					retData = await blockService.getBlockSummaryByBlockHeight(tmp.toNumber());
				} else {
					retData = await blockService.getBlockSummaryByBlockHash(queryParam);
				}

			}
			resJson = new ResponseModel(ResponseCode.SUCCESS, retData);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new BlockController();
