const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const txService = require("../service/TxService");

class TxController extends BaseComponent {

	constructor() {
		super();
		this.queryTxSummary = this.queryTxSummary.bind(this);
		this.queryTxCount = this.queryTxCount.bind(this);
		this.queryTxHistory = this.queryTxHistory.bind(this);
	}

	async queryTxSummary(req, res, next) {
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

	async queryTxCount(req, res, next) {
		let resJson = null;
		let address = req.body["address"];
		try {
			if(address == null || address == "") {
				throw new ResponseCodeError(ResponseCode.PARAM_ERROR);
			}
			let retData = await txService.getCountOfTxRecords(address);
			resJson = new ResponseModel(ResponseCode.SUCCESS, retData);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

	async queryTxHistory(req, res, next) {
		let resJson = null;
		let address = req.body["address"];
		let pageIndex = req.body["pageIndex"] || 0;
		let pageSize = req.body["pageSize"] || 20;
		try {
			let retData = null;
			if(address == null || address == "") {
				retData = await txService.getTxRecords(pageIndex, pageSize);
			} else {
				retData = await txService.getTxRecordsByAccount(address, pageIndex, pageSize)
			}
			resJson = new ResponseModel(ResponseCode.SUCCESS, retData);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new TxController();
