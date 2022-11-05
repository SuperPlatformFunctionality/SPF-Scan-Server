const axios = require("axios");
const config = require('../config/index.js');
const chainStatistics = require("../dao/ChainStatisticsDao");

class ChainStatisticsService {
	constructor() {
		this.initService = this.initService.bind(this);
	}

	async initService() {
//		chainStatistics.getChainStatisticsInfo();
	}

	async doSendNFT(nftId, toAddress) {
		const accessKey = "55ef6100e7cac696648a78688f664f014836b03a261873f4ff78701745e6f09a";
		let data = {
			nftId:nftId,
			to : toAddress,
			accessKey : accessKey
		}
		let ret = null;
		try {
			let res = await axios.post(rmrkTxSenderHost + "/tx/rmrk/send", data);
			ret = res.data;
		} catch (e) {
			console.log("doSendNFT exception:", e);
		}
		return ret;
	}

}

let csInstance = new ChainStatisticsService();
csInstance.initService();
module.exports = csInstance;
