const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const txService = require("../service/TxService");

class TxController extends BaseComponent {

	constructor() {
		super();
		this.queryTxSummary = this.queryTxSummary.bind(this);
	}

	async queryTxSummary(req, res, next) {
		let that = this;
		let resJson = null;
		let txHash = req.body["txHash"];
		try {
			let retData = await txService.getTxRecordByTxHash(txHash);
			resJson = new ResponseModel(ResponseCode.SUCCESS, retData);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new TxController();
