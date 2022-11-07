const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const blockService = require("../service/BlockService");
const MyUtils = require("../utils/MyUtils");

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
		let queryParam = req.body["queryParam"].toString();
		queryParam = queryParam.trim().toLowerCase();
		try {
			let retData = null;
			if(MyUtils.isInteger(queryParam)) {
				retData = await blockService.getBlockSummaryByBlockHeight(queryParam);
			} else if(that.isBlockHash(queryParam)) {
				retData = await blockService.getBlockSummaryByBlockHash(queryParam);
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
