const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const chainStatisticsService = require("../service/ChainStatisticsService");
const MyUtils = require("../utils/MyUtils");

class ChainController extends BaseComponent {

	constructor() {
		super();
	}

	async queryChainSummary(req, res, next) {
		let that = this;
		let resJson = null;
		try {
			let retData = await chainStatisticsService.getChainStatisticsInfo();
			resJson = new ResponseModel(ResponseCode.SUCCESS, retData);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new ChainController();
