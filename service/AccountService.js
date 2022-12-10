const AccountDao = require("../dao/AccountDao");
const TxRecordDao = require("../dao/TxRecordDao");
const Decimal = require("decimal.js");
const web3Config = require("./web3Config");
const web3Instance = web3Config.web3Instance;
const MyUtils = require("../utils/MyUtils");

class AccountService {
	constructor() {
		this.init = this.init.bind(this);
		this.getAccountSummary = this.getAccountSummary.bind(this);
	}

	async init() {

	}

	async getAccountSummary(address) {
		let tx = await AccountDao.getAccountByAddress(address);
		try {
			let ethAddress = MyUtils.transferAddressFromSPFToETH(address);
			let amount = await web3Instance.eth.getBalance(ethAddress);
			tx.balance = amount;
		} catch (e) {
			console.log(`getAccountSummary exception when get balance of ${address}`, e);
			tx.balance = "0";
		}
		return tx;
	}

}


let acntInstance = new AccountService();
acntInstance.init();
module.exports = acntInstance;
