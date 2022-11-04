const ResponseModel = require("../utils/ResponseModel");
const ResponseCode = require("../utils/ResponseCode");
const ResponseCodeError = require("../utils/ResponseCodeError");

const accessKey = "55ef6100e7cac696648a78688f664f014836b03a261873f4ff78701745e6f14u";
class AuthMiddleWare {
	constructor() {
		this.checkInnerNetAccessKey = this.checkInnerNetAccessKey.bind(this);
	}

	async checkInnerNetAccessKey(req, res, next) {
		let resJson = new ResponseModel(ResponseCode.PARAM_ERROR);
		let accessKeyIn = req.body["accessKey"];

		let ok = false;
		try {
			if(accessKeyIn != accessKey) {
				resJson = new ResponseModel(ResponseCode.NO_AUTHORITY);
			} else {
				ok = true;
			}
		} catch (e) {
			console.log("AuthMiddleWare.checkInnerNetAccessKey", e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		if(ok) {
			next();
		} else {
			res.send(resJson);
			return;
		}
	}
}

module.exports = new AuthMiddleWare()
