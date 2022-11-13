const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const accountService = require("../service/AccountService");

class AccountController extends BaseComponent {

	constructor() {
		super();
		this.queryAccountSummary = this.queryAccountSummary.bind(this);
	}

	async queryAccountSummary(req, res, next) {
		let that = this;
		let resJson = null;
		let address = req.body["address"];
		try {
			let retData = await accountService.getAccountSummary(address);
			resJson = new ResponseModel(ResponseCode.SUCCESS, retData);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new AccountController();
