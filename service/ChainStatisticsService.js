const axios = require("axios");
const config = require('../config/index.js');
const chainStatistics = require("../dao/ChainStatisticsDao");
const chainMonitor = require("./ChainMonitor");


class ChainStatisticsService {

	constructor() {
		this.init = this.init.bind(this);
	}

	async init() {
		await chainStatistics.initChainStatisticsDao();
		await chainMonitor.startMonitor();
	}

	async getChainStatisticsInfo() {
		return chainMonitor.getChainStatistics();
	}

}

let csInstance = new ChainStatisticsService();
csInstance.init();
module.exports = csInstance;
